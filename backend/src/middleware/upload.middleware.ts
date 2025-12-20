import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '@common/errors';
import { HTTP_STATUS } from '@fullstack-master/shared';

/**
 * Multer Configuration for File Uploads
 * 
 * - Uses memory storage to buffer files
 * - 10MB file size limit
 * - Validates file types (images and videos only)
 */

// Memory storage - files stored in buffer
const storage = multer.memoryStorage();

// File filter - only allow images and videos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed mime types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestError(
            'Invalid file type. Only images (JPEG, PNG, GIF, WEBP) and videos (MP4, MOV, AVI) are allowed.'
        ) as any);
    }
};

// Multer upload configuration
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB in bytes
    },
    fileFilter,
});

// Middleware for single file upload
export const uploadSingle = upload.single('file') as any;

