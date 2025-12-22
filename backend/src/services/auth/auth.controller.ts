import { Response } from "express";
import * as authService from "./auth.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { setAuthCookies, clearAuthCookies } from "@common/utils/cookie.util";
import { UnauthorizedError } from "@common/errors";

export const register = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email, password, name } = req.body;
        const result = await authService.register(email, password, name);

        sendSuccess(res, null, result.message);
    }
);

export const verifyEmail = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email, otp } = req.body;
        const { user, accessToken, refreshToken } =
            await authService.verifyEmail(email, otp);

        // Set cookies for web clients
        setAuthCookies(res, accessToken, refreshToken);

        sendSuccess(
            res,
            {
                user,
                tokens: { accessToken, refreshToken },
            },
            "Email verified successfully"
        );
    }
);

export const resendVerificationOTP = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email } = req.body;
        await authService.resendVerificationOTP(email);

        sendSuccess(res, null, "Verification code sent to your email");
    }
);

export const login = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.login(
            email,
            password
        );

        // Set cookies for web clients
        setAuthCookies(res, accessToken, refreshToken);

        sendSuccess(
            res,
            {
                user,
                tokens: { accessToken, refreshToken },
            },
            "Login successful"
        );
    }
);

export const refreshToken = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        // Support both cookie-based (web) and body-based (mobile) refresh tokens
        const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token not provided");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await authService.refreshAccessToken(refreshToken);

        // Set new cookies (for web clients)
        setAuthCookies(res, accessToken, newRefreshToken);

        sendSuccess(res, {
            tokens: { accessToken, refreshToken: newRefreshToken },
        });
    }
);

export const requestPasswordReset = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email } = req.body;
        await authService.requestPasswordReset(email);

        sendSuccess(res, null, "If the email exists, a password reset code has been sent");
    }
);

export const resetPassword = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { email, otp, newPassword } = req.body;
        await authService.resetPassword(email, otp, newPassword);

        sendSuccess(res, null, "Password reset successfully");
    }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await authService.logout(userId);

    // Clear auth cookies with proper options
    clearAuthCookies(res);

    sendSuccess(res, null, "Logged out successfully");
});




export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    const { accessToken, refreshToken } = await authService.changePassword(userId, currentPassword, newPassword);

    // Set new cookies after password change
    setAuthCookies(res, accessToken, refreshToken);

    sendSuccess(res, {
        tokens: { accessToken, refreshToken }
    }, "Password changed successfully");
});
