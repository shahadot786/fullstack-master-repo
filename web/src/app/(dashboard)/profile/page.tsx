'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Profile Page
 * User profile management with update functionality
 */
export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  /**
   * Validate form fields
   */
  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation (only if user wants to change password)
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
        isValid = false;
      }

      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
        isValid = false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handle profile update
   */
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      const updateData: any = {
        name: formData.name,
      };

      // Only include password fields if user wants to change password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Refresh user data
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullPage text="Loading profile..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Profile Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account information and password</p>
      </div>

      {/* Profile Card */}
      <Card padding="lg">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Profile Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                leftIcon={<User size={18} />}
                disabled={loading}
              />

              {/* Email */}
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                leftIcon={<Mail size={18} />}
                disabled={true}
                helperText="Email cannot be changed"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Password Section */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Change Password</h2>
            <p className="text-sm text-text-muted mb-4">
              Leave blank if you don't want to change your password
            </p>
            
            <div className="space-y-4">
              {/* Current Password */}
              <Input
                type="password"
                label="Current Password"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                error={errors.currentPassword}
                leftIcon={<Lock size={18} />}
                disabled={loading}
              />

              {/* New Password */}
              <Input
                type="password"
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                error={errors.newPassword}
                leftIcon={<Lock size={18} />}
                disabled={loading}
                helperText="Must be at least 8 characters"
              />

              {/* Confirm Password */}
              <Input
                type="password"
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                leftIcon={<Lock size={18} />}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" loading={loading}>
              <Save size={18} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Info Card */}
      <Card padding="md">
        <h3 className="font-semibold text-text-primary mb-3">Account Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Account ID:</span>
            <span className="text-text-primary font-mono text-xs">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Email Verified:</span>
            <span className={user.isEmailVerified ? 'text-success' : 'text-warning'}>
              {user.isEmailVerified ? '✓ Verified' : '⚠ Not Verified'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
