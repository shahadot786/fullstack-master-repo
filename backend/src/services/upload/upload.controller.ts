import { Response } from 'express';
import * as uploadService from './upload.service';
import { asyncHandler } from '@common/utils/async-handler.util';
import { sendSuccess } from '@common/utils/response.util';
import { AuthRequest } from '@middleware/auth.middleware';
import { HTTP_STATUS } from '@fullstack-master/shared';
import { BadRequestError } from '@common/errors';

/**
 * Upload Controller
 * 
 * Handles file upload HTTP requests
 */

export const uploadFile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
        throw new BadRequestError('No file provided');
    }

    const folder = req.body.folder || 'uploads';
    const originalFilename = file.originalname;

    const uploadResult = await uploadService.uploadFile(file.buffer, {
        userId,
        folder,
        originalFilename,
    });

    sendSuccess(
        res,
        uploadResult,
        'File uploaded successfully',
        HTTP_STATUS.CREATED
    );
});

export const deleteFile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const fileId = req.params.id;

    await uploadService.deleteFile(fileId, userId);

    sendSuccess(res, null, 'File deleted successfully');
});

export const getFile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const fileId = req.params.id;

    const file = await uploadService.getFileById(fileId);

    sendSuccess(res, file);
});

export const getMyFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const result = await uploadService.getUserFiles(userId, limit, skip);

    sendSuccess(res, result);
});
