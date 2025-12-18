import { Router } from 'express';
import * as userController from './user.controller';
import { authenticate } from '@middleware/auth.middleware';
import { validate } from '@middleware/validation.middleware';
import { updateProfileValidation, getAllUsersValidation } from './user.validation';

const router = Router();

/**
 * User Routes
 * 
 * All routes require authentication
 */

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticate, userController.getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile (name, email, password, profileImage - all optional)
// @access  Private
router.put('/profile', authenticate, validate(updateProfileValidation), userController.updateProfile);

// @route   DELETE /api/user/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', authenticate, userController.deleteProfile);

// @route   GET /api/user/all
// @desc    Get all users (admin endpoint, paginated)
// @access  Private (Admin)
router.get('/all', authenticate, userController.getAllUsers);

export default router;
