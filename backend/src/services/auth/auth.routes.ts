import { Router } from "express";
import * as controller from "./auth.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validation.middleware";
import {
    registerValidation,
    loginValidation,
    verifyEmailValidation,
    resendOTPValidation,
    refreshTokenValidation,
    requestPasswordResetValidation,
    resetPasswordValidation,
    updateProfileValidation,
    requestEmailChangeValidation,
    verifyEmailChangeValidation,
    changePasswordValidation,
} from "./auth.validation";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *       409:
 *         description: Email already exists
 */
router.post("/register", validate(registerValidation), controller.register);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email with OTP (handles both registration and email change)
 *     description: |
 *       This endpoint intelligently handles two scenarios:
 *       1. **Registration verification** - Verifies new user email during registration (unauthenticated)
 *       2. **Email change verification** - Verifies new email for existing user (authenticated, optional)
 *       
 *       The endpoint automatically detects which flow to use based on the email provided.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to verify (new user email for registration, new email for email change)
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP code sent to the email
 *     responses:
 *       200:
 *         description: Email verified successfully with user data and tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Invalid or expired OTP
 */
router.post(
    "/verify-email",
    validate(verifyEmailValidation),
    controller.verifyEmail
);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend verification OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code sent
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already verified
 */
router.post(
    "/resend-verification",
    validate(resendOTPValidation),
    controller.resendVerificationOTP
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginValidation), controller.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
    "/refresh-token",
    validate(refreshTokenValidation),
    controller.refreshToken
);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset code sent if email exists
 */
router.post(
    "/request-password-reset",
    validate(requestPasswordResetValidation),
    controller.requestPasswordReset
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP code
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       401:
 *         description: Invalid or expired OTP
 */
router.post(
    "/reset-password",
    validate(resetPasswordValidation),
    controller.resetPassword
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use GET /api/user/profile instead.
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, controller.getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", authenticate, controller.logout);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile (name only)
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use PUT /api/user/profile instead.
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully with new tokens
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authenticate, validate(updateProfileValidation), controller.updateProfile);

/**
 * @swagger
 * /api/auth/request-email-change:
 *   post:
 *     summary: Request email change (sends OTP to new email)
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use POST /api/user/request-email-change instead.
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *             properties:
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification code sent to new email
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use
 */
router.post("/request-email-change", authenticate, validate(requestEmailChangeValidation), controller.requestEmailChange);

/**
 * @swagger
 * /api/auth/verify-email-change:
 *   post:
 *     summary: Verify email change with OTP
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use POST /api/auth/verify-email instead (unified endpoint).
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *               - otp
 *             properties:
 *               newEmail:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email changed successfully with new tokens
 *       401:
 *         description: Unauthorized or invalid OTP
 */
router.post("/verify-email-change", authenticate, validate(verifyEmailChangeValidation), controller.verifyEmailChange);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     description: Changes the user's password and returns new authentication tokens for security
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully with new tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                         refreshToken:
 *                           type: string
 *       401:
 *         description: Unauthorized or incorrect current password
 */
router.put("/change-password", authenticate, validate(changePasswordValidation), controller.changePassword);

/**
 * @swagger
 * /api/auth/whoAmI:
 *   get:
 *     summary: Get current user with fresh tokens (post-login sync)
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use GET /api/user/profile instead.
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data and tokens retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/whoAmI", authenticate, controller.whoAmI);

/**
 * @swagger
 * /api/auth/profile-image:
 *   put:
 *     summary: Update user profile image
 *     deprecated: true
 *     description: |
 *       **DEPRECATED**: Use PUT /api/user/profile instead.
 *       This endpoint will be removed on 2025-02-01.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileImageUrl
 *             properties:
 *               profileImageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile image updated successfully with new tokens
 *       401:
 *         description: Unauthorized
 */
router.put("/profile-image", authenticate, controller.updateProfileImage);

export default router;
