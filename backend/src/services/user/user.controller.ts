import { Response } from 'express';
import * as userService from './user.service';
import { asyncHandler } from '@common/utils/async-handler.util';
import { sendSuccess } from '@common/utils/response.util';
import { AuthRequest } from '@middleware/auth.middleware';
import { HTTP_STATUS } from '@fullstack-master/shared';

/**
 * User Controller
 * 
 * Handles user profile HTTP requests
 */

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const user = await userService.getProfile(userId);

    sendSuccess(res, user);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name, email, password, currentPassword, profileImage } = req.body;

    const result = await userService.updateProfile(userId, {
        name,
        email,
        password,
        currentPassword,
        profileImage,
    });

    // If email change requested, return message
    if (result.message) {
        sendSuccess(res, null, result.message);
        return;
    }

    // Set cookies if tokens were updated
    if (result.tokens) {
        setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    }

    sendSuccess(res, {
        user: result.user,
        tokens: result.tokens,
    }, 'Profile updated successfully');
});

export const deleteProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    await userService.deleteProfile(userId);

    // Clear auth cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    sendSuccess(res, null, 'Profile deleted successfully');
});

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const result = await userService.getAllUsers(limit, skip);

    sendSuccess(res, result);
});

/**
 * Request email change
 * Sends OTP to new email for verification
 */
export const requestEmailChange = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { newEmail } = req.body;

    await userService.requestEmailChange(userId, newEmail);

    sendSuccess(res, null, 'Verification code sent to your new email');
});

// Helper function to set auth cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token - short-lived (15 minutes)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Refresh token - long-lived (7 days)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
