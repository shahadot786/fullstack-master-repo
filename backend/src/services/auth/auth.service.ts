import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUser } from "./auth.model";
import { config } from "@config/index";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "@common/errors";
import { ERROR_MESSAGES } from "@fullstack-master/shared";
import {
  generateOTP,
  storeOTP,
  verifyOTP,
  getEmailVerificationKey,
  getPasswordResetKey,
  storeRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
} from "@common/utils/otp.util";
import {
  storePendingUser,
  getPendingUser,
  deletePendingUser,
  pendingUserExists,
} from "@common/utils/pending-user.util";
import { sendOTPEmail } from "@common/services/email.service";

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<{ message: string }> => {
  // Check if user already exists in MongoDB (verified users)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_EXISTS);
  }

  // Check if user has pending registration
  const hasPendingRegistration = await pendingUserExists(email);
  if (hasPendingRegistration) {
    throw new ConflictError(
      "Registration already pending. Please check your email for verification code or request a new one."
    );
  }

  // Store pending user data in Redis (password will be hashed inside)
  await storePendingUser(email, password, name);

  // Generate OTP for email verification
  const otp = generateOTP();
  const otpKey = getEmailVerificationKey(email);
  await storeOTP(otpKey, otp);

  // Send OTP email
  await sendOTPEmail(email, otp, "verification");

  return {
    message:
      "Registration initiated. Please check your email for verification code.",
  };
};

export const verifyEmail = async (
  email: string,
  otp: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  const otpKey = getEmailVerificationKey(email);
  const isValid = await verifyOTP(otpKey, otp);

  if (!isValid) {
    throw new UnauthorizedError("Invalid or expired OTP");
  }

  // Retrieve pending user data from Redis
  const pendingUser = await getPendingUser(email);
  if (!pendingUser) {
    throw new NotFoundError(
      "Pending registration not found. Please register again."
    );
  }

  // Create user in MongoDB with verified status
  // Password from Redis is plain text and will be hashed by the pre-save hook
  const user = await User.create({
    email: pendingUser.email,
    password: pendingUser.password, // Plain password - will be hashed by pre-save hook
    name: pendingUser.name,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
  });

  // Delete pending user data from Redis
  await deletePendingUser(email);

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  // Store refresh token in Redis
  await storeRefreshToken(user._id.toString(), refreshToken);

  // Remove password from response
  user.password = undefined as any;

  return { user, accessToken, refreshToken };
};

export const resendVerificationOTP = async (email: string): Promise<void> => {
  // Check if user has pending registration in Redis
  const pendingUser = await getPendingUser(email);
  if (!pendingUser) {
    // Check if user already exists and is verified
    const user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      throw new ConflictError("Email already verified");
    }
    throw new NotFoundError(
      "Pending registration not found. Please register again."
    );
  }

  // Generate and send new OTP
  const otp = generateOTP();
  const otpKey = getEmailVerificationKey(email);
  await storeOTP(otpKey, otp);
  await sendOTPEmail(email, otp, "verification");
};

export const login = async (
  email: string,
  password: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
  // Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString(), user.email);

  // Store refresh token in Redis
  await storeRefreshToken(user._id.toString(), refreshToken);

  // Remove password from response
  user.password = undefined as any;

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
      id: string;
      email: string;
    };

    // Verify token exists in Redis
    const isValid = await verifyRefreshToken(decoded.id, refreshToken);
    if (!isValid) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.id, decoded.email);
    const newRefreshToken = generateRefreshToken(decoded.id, decoded.email);

    // Update refresh token in Redis
    await storeRefreshToken(decoded.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return;
  }

  // Generate and send OTP
  const otp = generateOTP();
  const otpKey = getPasswordResetKey(email);
  await storeOTP(otpKey, otp);
  await sendOTPEmail(email, otp, "password-reset");
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  const otpKey = getPasswordResetKey(email);
  const isValid = await verifyOTP(otpKey, otp);

  if (!isValid) {
    throw new UnauthorizedError("Invalid or expired OTP");
  }

  // Update password
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.password = newPassword;
  await user.save();

  // Invalidate all refresh tokens for this user
  await deleteRefreshToken(user._id.toString());
};

export const logout = async (userId: string): Promise<void> => {
  await deleteRefreshToken(userId);
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId);
};

export const updateProfile = async (
  userId: string,
  data: { name?: string; email?: string }
): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if email is being changed and if it already exists
  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }
    user.email = data.email;
    // Reset email verification if email is changed
    user.isEmailVerified = false;
    user.emailVerifiedAt = undefined;
  }

  if (data.name) {
    user.name = data.name;
  }

  await user.save();
  return user;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Invalidate all refresh tokens for this user
  await deleteRefreshToken(user._id.toString());
};

// Helper function to generate access token
const generateAccessToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

// Helper function to generate refresh token
const generateRefreshToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
};
