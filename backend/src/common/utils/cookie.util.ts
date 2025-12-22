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
    
    // Cookie domain (optional - set if using subdomains like api.example.com and app.example.com)
    // Example: If COOKIE_DOMAIN=.example.com, cookies will work across all subdomains
    const cookieDomain = process.env.COOKIE_DOMAIN;

    // Common cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction, // Requires HTTPS in production
        sameSite: isProduction ? 'none' as const : 'lax' as const, // 'none' allows cross-origin in production
        ...(cookieDomain && { domain: cookieDomain }), // Add domain if specified
    };

    // Access token - short-lived (10 minutes)
    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 10 * 60 * 1000, // 10 minutes
    });

    // Refresh token - long-lived (30 days)
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response): void => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;
    
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const,
        ...(cookieDomain && { domain: cookieDomain }),
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
};
