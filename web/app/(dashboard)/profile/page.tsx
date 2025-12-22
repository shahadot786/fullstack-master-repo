"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { authApi, userApi } from "@/lib/api";
import { uploadApi } from "@/lib/api/upload";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Mail, User, Calendar, Edit, Key, Eye, EyeOff, Camera, Loader2 } from "lucide-react";
import { format } from "date-fns";

const editProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
});

const verifyEmailSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;
type EmailChangeFormValues = z.infer<typeof emailChangeSchema>;
type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isVerifyEmailDialogOpen, setIsVerifyEmailDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newEmailForVerification, setNewEmailForVerification] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editForm = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const emailChangeForm = useForm<EmailChangeFormValues>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const verifyEmailForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onEditSubmit = async (data: EditProfileFormValues) => {
    try {
      setError("");
      setSuccess("");
      const response = await userApi.updateProfile(data);
      // Check if response has user (name updated) or message (email change initiated)
      if ('user' in response) {
        setUser(response.user);
        setSuccess("Profile updated successfully!");
      } else {
        setSuccess(response.message);
      }
      setIsEditDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const onEmailChangeSubmit = async (data: EmailChangeFormValues) => {
    try {
      setError("");
      setSuccess("");
      await userApi.requestEmailChange(data.newEmail);
      setNewEmailForVerification(data.newEmail);
      setIsEmailDialogOpen(false);
      setIsVerifyEmailDialogOpen(true);
      setSuccess("Verification code sent to your new email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request email change");
    }
  };

  const onVerifyEmailSubmit = async (data: VerifyEmailFormValues) => {
    try {
      setError("");
      setSuccess("");
      const response = await authApi.verifyEmail({
        email: newEmailForVerification,
        otp: data.otp,
      });
      // Update user in store to refresh UI immediately
      setUser(response.user);
      setSuccess("Email changed successfully!");
      setIsVerifyEmailDialogOpen(false);
      verifyEmailForm.reset();
      emailChangeForm.reset();
      setNewEmailForVerification("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify email change");
    }
  };

  const handleResendEmailOTP = async () => {
    try {
      setError("");
      await userApi.requestEmailChange(newEmailForVerification);
      setSuccess("Verification code resent to your new email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    try {
      setError("");
      setSuccess("");
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      // Password changed successfully (cookies updated by backend)
      setSuccess("Password changed successfully!");
      setIsPasswordDialogOpen(false);
      passwordForm.reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP image.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Maximum size is 10MB.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setIsUploadingImage(true);

      // Upload image to Cloudinary
      const uploadResult = await uploadApi.uploadFile(file, "profile-images");

      // Update profile with new image URL using the new user API
      const response = await userApi.updateProfile({ profileImage: uploadResult.url });

      // Check if response has user (should have for profileImage update)
      if ('user' in response) {
        setUser(response.user);
      }
      setSuccess("Profile image updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload profile image");
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your account details and verification status
              </CardDescription>
            </div>
            <Button onClick={() => setIsEditDialogOpen(true)} variant="outline" className="w-full sm:w-auto">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Upload profile image"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400 flex items-center text-sm">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </Label>
              <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                {user.name}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400 flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </Label>
              <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base break-all">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400 flex items-center text-sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Email Verification
              </Label>
              <div className="flex items-center">
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Not Verified
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500 dark:text-gray-400 flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Member Since
              </Label>
              <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                {format(new Date(user.createdAt), "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    Email Address
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Change your account email
                  </p>
                </div>
                <Button
                  onClick={() => setIsEmailDialogOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Change Email
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    Password
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Last changed: {format(new Date(user.updatedAt), "MMMM dd, yyyy")}
                  </p>
                </div>
                <Button
                  onClick={() => setIsPasswordDialogOpen(true)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
            <DialogDescription>
              Enter your new email address. We'll send a verification code to confirm the change.
            </DialogDescription>
          </DialogHeader>
          <Form {...emailChangeForm}>
            <form
              onSubmit={emailChangeForm.handleSubmit(onEmailChangeSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailChangeForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter new email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEmailDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Verification Code</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Verify Email Change Dialog */}
      <Dialog open={isVerifyEmailDialogOpen} onOpenChange={setIsVerifyEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Email Change</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to {newEmailForVerification}
            </DialogDescription>
          </DialogHeader>
          <Form {...verifyEmailForm}>
            <form
              onSubmit={verifyEmailForm.handleSubmit(onVerifyEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={verifyEmailForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendEmailOTP}
                  className="text-sm"
                >
                  Resend Code
                </Button>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsVerifyEmailDialogOpen(false);
                    verifyEmailForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Verify Email</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    passwordForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Change Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
