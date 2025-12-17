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

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const user = await authService.getUserById(userId);

    sendSuccess(res, user);
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await authService.logout(userId);

    sendSuccess(res, null, "Logged out successfully");
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { name, email } = req.body;
    const user = await authService.updateProfile(userId, { name, email });

    sendSuccess(res, { user }, "Profile updated successfully");
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(userId, currentPassword, newPassword);

    sendSuccess(res, null, "Password changed successfully");
});
