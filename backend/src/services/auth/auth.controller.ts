import { Response } from "express";
import * as authService from "./auth.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, name } = req.body;
    const { message } = await authService.register(email, password, name);

    sendSuccess(
        res,
        { message },
        "Registration initiated successfully",
        HTTP_STATUS.OK
    );
});


export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, otp } = req.body;
    const { user, accessToken, refreshToken } = await authService.verifyEmail(email, otp);

    // Set cookies for web
    setAuthCookies(res, accessToken, refreshToken);

    sendSuccess(
        res,
        {
            user,
            tokens: { accessToken, refreshToken },
        },
        "Email verified successfully",
        HTTP_STATUS.CREATED
    );
});

export const resendVerificationOTP = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email } = req.body;
        await authService.resendVerificationOTP(email);

        sendSuccess(res, null, "Verification code sent to your email");
    }
);

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
        email,
        password
    );

    // Set cookies for web
    setAuthCookies(res, accessToken, refreshToken);

    sendSuccess(res, {
        user,
        tokens: { accessToken, refreshToken },
    });
});

export const refreshToken = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);

    sendSuccess(res, { tokens }, "Token refreshed successfully");
});

export const requestPasswordReset = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email } = req.body;
        await authService.requestPasswordReset(email);

        sendSuccess(
            res,
            null,
            "If the email exists, a password reset code has been sent"
        );
    }
);

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);

    sendSuccess(res, null, "Password reset successfully");
});



export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await authService.logout(userId);

    sendSuccess(res, null, "Logged out successfully");
});







export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    const { accessToken, refreshToken } = await authService.changePassword(userId, currentPassword, newPassword);

    sendSuccess(res, { 
        tokens: { accessToken, refreshToken }
    }, "Password changed successfully");
});





// Helper function to set auth cookies
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
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
