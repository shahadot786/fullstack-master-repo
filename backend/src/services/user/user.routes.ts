import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '@middleware/auth.middleware';
import { validate } from '@middleware/validation.middleware';
import { updateProfileValidation, getAllUsersValidation, requestEmailChangeValidation } from './user.validation';

const router = Router();

/**
 * User Routes
 * 
 * All routes require authentication
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the authenticated user's profile information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                     isEmailVerified:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     description: |
 *       Update user profile information. All fields are optional.
 *       - **Name**: Updates user's display name and returns new tokens
 *       - **Profile Image**: Updates profile image URL, deletes old image from Cloudinary, returns new tokens
 *       - **Password**: Requires currentPassword, updates password, returns new tokens
 *       - **Email**: Initiates email change flow, sends OTP to new email, returns message (no tokens)
 *     tags: [User]
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
 *                 minLength: 2
 *                 maxLength: 50
 *               profileImage:
 *                 type: string
 *                 format: uri
 *               password:
 *                 type: string
 *                 minLength: 8
 *               currentPassword:
 *                 type: string
 *                 description: Required when updating password
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Initiates email change flow with OTP verification
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       description: When name, password, or profileImage updated
 *                       properties:
 *                         user:
 *                           type: object
 *                         tokens:
 *                           type: object
 *                           properties:
 *                             accessToken:
 *                               type: string
 *                             refreshToken:
 *                               type: string
 *                     - type: object
 *                       description: When email change initiated
 *                       properties:
 *                         message:
 *                           type: string
 *       400:
 *         description: Bad request (e.g., current password required for password update)
 *       401:
 *         description: Unauthorized or incorrect current password
 *       409:
 *         description: Email already in use
 */
router.put('/profile', authenticate, validate(updateProfileValidation), userController.updateProfile);

/**
 * @swagger
 * /api/user/profile:
 *   delete:
 *     summary: Delete user account
 *     description: |
 *       Permanently deletes the user's account and all associated data.
 *       - Deletes profile image from Cloudinary (if exists)
 *       - Removes user from database
 *       - Invalidates all refresh tokens
 *       
 *       **Warning:** This action cannot be undone.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/profile', authenticate, userController.deleteProfile);

/**
 * @swagger
 * /api/user/request-email-change:
 *   post:
 *     summary: Request email change (sends OTP to new email)
 *     description: |
 *       Initiates the email change process by sending an OTP to the new email address.
 *       After receiving the OTP, use POST /api/auth/verify-email to complete the change.
 *       
 *       **Flow:**
 *       1. Call this endpoint with new email
 *       2. Receive OTP at new email address
 *       3. Call POST /api/auth/verify-email with new email and OTP
 *       4. Email is updated and new tokens are returned
 *     tags: [User]
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
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification code sent to new email
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already in use or same as current email
 */
router.post('/request-email-change', authenticate, validate(requestEmailChangeValidation), userController.requestEmailChange);

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users (admin endpoint)
 *     description: |
 *       Retrieves a paginated list of all users in the system.
 *       **Note:** This is an admin endpoint and should be protected with admin authorization middleware.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of users to skip (for pagination)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/all', authenticate, userController.getAllUsers);

export default router;
