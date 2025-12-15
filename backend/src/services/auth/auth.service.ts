import jwt from "jsonwebtoken";
import User, { IUser } from "./auth.model";
import { config } from "@config/index";
import { ConflictError, UnauthorizedError, NotFoundError } from "@common/errors";
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
import { sendOTPEmail } from "@common/services/email.service";

export const register = async (
    email: string,
    password: string,
    name: string
): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_EXISTS);
    }

    // Create new user (email not verified yet)
    const user = await User.create({
        email,
        password,
        name,
        isEmailVerified: false,
    });

    // Generate OTP for email verification
    const otp = generateOTP();
    const otpKey = getEmailVerificationKey(email);
    await storeOTP(otpKey, otp);

    // Send OTP email
    await sendOTPEmail(email, otp, "verification");

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString(), user.email);
    const refreshToken = generateRefreshToken(user._id.toString(), user.email);

    // Store refresh token in Redis
    await storeRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
};

export const verifyEmail = async (email: string, otp: string): Promise<void> => {
    const otpKey = getEmailVerificationKey(email);
    const isValid = await verifyOTP(otpKey, otp);

    if (!isValid) {
        throw new UnauthorizedError("Invalid or expired OTP");
    }

    // Update user email verification status
    await User.findOneAndUpdate(
        { email },
        {
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
        }
    );
};

export const resendVerificationOTP = async (email: string): Promise<void> => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("User not found");
    }

    if (user.isEmailVerified) {
        throw new ConflictError("Email already verified");
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

// Helper function to generate access token
const generateAccessToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

// Helper function to generate refresh token
const generateRefreshToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};
