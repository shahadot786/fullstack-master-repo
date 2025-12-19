import User from '@services/auth/auth.model';
import { NotFoundError, BadRequestError, UnauthorizedError, ConflictError } from '@common/errors';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '@config/index';
import {
    storeRefreshToken,
    deleteRefreshToken,
    generateOTP,
    storeOTP,
    getEmailVerificationKey,
} from '@common/utils/otp.util';
import { deleteOldProfileImage } from '@common/utils/cloudinary.util';
import { sendOTPEmail } from '@common/services/email.service';

/**
 * User Service
 * 
 * Handles user profile CRUD operations
 */

// Helper functions for token generation
const generateAccessToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as SignOptions);
};

const generateRefreshToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    } as SignOptions);
};

/**
 * Get user profile
 */
export const getProfile = async (userId: string) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new NotFoundError('User not found');
    }

    return user;
};

/**
 * Smart update profile
 * Handles: name, email, password, profileImage (all optional)
 */
export const updateProfile = async (
    userId: string,
    data: {
        name?: string;
        email?: string;
        password?: string;
        currentPassword?: string;
        profileImage?: string;
    }
): Promise<{
    user?: any;
    tokens?: { accessToken: string; refreshToken: string };
    message?: string;
}> => {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
        throw new NotFoundError('User not found');
    }

    let tokensUpdated = false;

    // Handle name update
    if (data.name !== undefined && data.name !== user.name) {
        user.name = data.name;
        tokensUpdated = true;
    }

    // Handle profile image update
    if (data.profileImage !== undefined && data.profileImage !== user.profileImage) {
        // Delete old profile image from Cloudinary if it exists
        if (user.profileImage) {
            await deleteOldProfileImage(user.profileImage);
        }
        
        user.profileImage = data.profileImage;
        tokensUpdated = true;
    }

    // Handle password update
    if (data.password) {
        if (!data.currentPassword) {
            throw new BadRequestError('Current password required to update password');
        }

        const isValid = await user.comparePassword(data.currentPassword);
        if (!isValid) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        user.password = data.password;
        tokensUpdated = true;
    }

    // Handle email update (triggers verification flow)
    if (data.email && data.email !== user.email) {
        // Check if new email is already in use
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new ConflictError('Email already in use');
        }

        // Generate OTP and store with email verification key (reuses registration flow)
        const otp = generateOTP();
        const otpKey = getEmailVerificationKey(data.email);
        await storeOTP(otpKey, otp);

        // Store pending email change in user document temporarily
        // This will be read by verify-email endpoint
        user.pendingEmail = data.email;
        await user.save();

        // Send OTP to new email
        await sendOTPEmail(data.email, otp, 'email-verification');
        
        return {
            message: `Verification code sent to ${data.email}. Use the OTP to complete email change.`,
        };
    }

    // Save changes if any
    if (tokensUpdated) {
        await user.save();

        // Generate new tokens
        const accessToken = generateAccessToken(user._id.toString(), user.email);
        const refreshToken = generateRefreshToken(user._id.toString(), user.email);
        await storeRefreshToken(user._id.toString(), refreshToken);

        // Remove password from response
        user.password = undefined as any;

        return {
            user,
            tokens: { accessToken, refreshToken },
        };
    }

    // No changes made
    user.password = undefined as any;
    return { user };
};

/**
 * Delete user profile
 */
export const deleteProfile = async (userId: string): Promise<void> => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Delete profile image from Cloudinary if it exists
    if (user.profileImage) {
        await deleteOldProfileImage(user.profileImage);
    }

    // Delete user
    await User.findByIdAndDelete(userId);
    
    // Delete refresh tokens
    await deleteRefreshToken(userId);
};

/**
 * Get all users (admin endpoint)
 */
export const getAllUsers = async (
    limit: number = 50,
    skip: number = 0
): Promise<{ users: any[]; total: number }> => {
    const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await User.countDocuments();

    return {
        users,
        total,
    };
};
