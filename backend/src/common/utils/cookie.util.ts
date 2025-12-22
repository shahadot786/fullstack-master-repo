import { Response } from 'express';

/**
 * Cookie Utilities
 * 
 * Common functions for managing authentication cookies
 */

/**
 * Set authentication cookies (access token and refresh token)
 */
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token - short-lived (10 minutes)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 10 * 60 * 1000, // 10 minutes
    });

    // Refresh token - long-lived (30 days)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response): void => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' as const : 'lax' as const,
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
};
