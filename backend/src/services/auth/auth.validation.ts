import { z } from "zod";
import {
    registerSchema,
    loginSchema,
} from "@fullstack-master/shared";

export const registerValidation = z.object({
    body: registerSchema,
});

export const loginValidation = z.object({
    body: loginSchema,
});

export const verifyEmailValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        otp: z.string().length(6, "OTP must be 6 digits"),
    }),
});

export const resendOTPValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
    }),
});

export const refreshTokenValidation = z.object({
    body: z.object({
        refreshToken: z.string().min(1, "Refresh token is required"),
    }),
});

export const requestPasswordResetValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
    }),
});

export const resetPasswordValidation = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        otp: z.string().length(6, "OTP must be 6 digits"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
    }),
});
