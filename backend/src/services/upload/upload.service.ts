import cloudinary from '@config/cloudinary.config';
import Upload from './upload.model';
import { NotFoundError, ForbiddenError, InternalServerError } from '@common/errors';
import { HTTP_STATUS } from '@fullstack-master/shared';
import { UploadApiResponse } from 'cloudinary';

/**
 * Upload Service
 * 
 * Handles file uploads to Cloudinary and stores metadata in MongoDB
 */

interface UploadFileOptions {
    userId: string;
    folder?: string;
    originalFilename?: string;
}

export const uploadFile = async (
    fileBuffer: Buffer,
    options: UploadFileOptions
): Promise<any> => {
    const { userId, folder = 'uploads', originalFilename } = options;

    try {
        // Upload to Cloudinary using upload_stream
        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto', // Automatically detect file type
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            );

            uploadStream.end(fileBuffer);
        });

        // Save metadata to MongoDB
        const upload = await Upload.create({
            publicId: uploadResult.public_id,
            url: uploadResult.url,
            secureUrl: uploadResult.secure_url,
            format: uploadResult.format,
            resourceType: uploadResult.resource_type,
            bytes: uploadResult.bytes,
            width: uploadResult.width,
            height: uploadResult.height,
            uploadedBy: userId,
            folder,
            originalFilename,
        });

        return {
            id: upload._id,
            publicId: upload.publicId,
            url: upload.secureUrl, // Always use secure URL
            format: upload.format,
            resourceType: upload.resourceType,
            bytes: upload.bytes,
            width: upload.width,
            height: upload.height,
            originalFilename: upload.originalFilename,
            createdAt: upload.createdAt,
        };
    } catch (error: any) {
        throw new InternalServerError(error.message || 'Failed to upload file');
    }
};

export const deleteFile = async (fileId: string, userId: string): Promise<void> => {
    const upload = await Upload.findById(fileId);

    if (!upload) {
        throw new NotFoundError('File not found');
    }

    // Verify ownership
    if (upload.uploadedBy.toString() !== userId) {
        throw new ForbiddenError('Unauthorized to delete this file');
    }

    try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(upload.publicId, {
            resource_type: upload.resourceType,
        });

        // Delete from MongoDB
        await Upload.findByIdAndDelete(fileId);
    } catch (error: any) {
        throw new InternalServerError(error.message || 'Failed to delete file');
    }
};

export const getFileById = async (fileId: string): Promise<any> => {
    const upload = await Upload.findById(fileId).populate('uploadedBy', 'name email');

    if (!upload) {
        throw new NotFoundError('File not found');
    }

    return {
        id: upload._id,
        publicId: upload.publicId,
        url: upload.secureUrl,
        format: upload.format,
        resourceType: upload.resourceType,
        bytes: upload.bytes,
        width: upload.width,
        height: upload.height,
        originalFilename: upload.originalFilename,
        uploadedBy: upload.uploadedBy,
        createdAt: upload.createdAt,
    };
};

export const getUserFiles = async (
    userId: string,
    limit: number = 50,
    skip: number = 0
): Promise<any> => {
    const uploads = await Upload.find({ uploadedBy: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const total = await Upload.countDocuments({ uploadedBy: userId });

    return {
        files: uploads.map((upload) => ({
            id: upload._id,
            publicId: upload.publicId,
            url: upload.secureUrl,
            format: upload.format,
            resourceType: upload.resourceType,
            bytes: upload.bytes,
            width: upload.width,
            height: upload.height,
            originalFilename: upload.originalFilename,
            createdAt: upload.createdAt,
        })),
        total,
        limit,
        skip,
    };
};
