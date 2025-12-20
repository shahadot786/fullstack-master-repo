import { Router } from 'express';
import * as uploadController from './upload.controller';
import { authenticate } from '@middleware/auth.middleware';
import { uploadSingle } from '@middleware/upload.middleware';

const router = Router();

/**
 * Upload Routes
 * 
 * All routes require authentication
 */

// @route   POST /api/upload
// @desc    Upload a file (image or video)
// @access  Private
router.post('/', authenticate, uploadSingle, uploadController.uploadFile);

// @route   DELETE /api/upload/:id
// @desc    Delete uploaded file
// @access  Private
router.delete('/:id', authenticate, uploadController.deleteFile);

// @route   GET /api/upload/:id
// @desc    Get file by ID
// @access  Private
router.get('/:id', authenticate, uploadController.getFile);

// @route   GET /api/upload/my-files
// @desc    Get all files uploaded by current user
// @access  Private
router.get('/my/files', authenticate, uploadController.getMyFiles);

export default router;
