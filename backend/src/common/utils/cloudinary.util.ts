import cloudinary from '@config/cloudinary.config';

/**
 * Cloudinary Utility Functions
 * 
 * Helper functions for managing Cloudinary resources
 */

/**
 * Extract public ID from Cloudinary URL
 * 
 * Example URLs:
 * - https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
 * - https://res.cloudinary.com/demo/image/upload/folder/image.jpg
 * 
 * Returns: folder/image (without extension)
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
    if (!url || typeof url !== 'string') {
        return null;
    }

    try {
        // Check if it's a Cloudinary URL
        if (!url.includes('cloudinary.com')) {
            return null;
        }

        // Extract the part after /upload/
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) {
            return null;
        }

        // Get everything after /upload/
        let pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);

        // Remove version number if present (v1234567890/)
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');

        // Remove file extension
        const lastDotIndex = pathAfterUpload.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
        }

        return pathAfterUpload;
    } catch (error) {
        return null;
    }
};

/**
 * Delete an image from Cloudinary using its public ID
 * 
 * @param publicId - The public ID of the image to delete
 * @throws Error if deletion fails
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    if (!publicId || typeof publicId !== 'string') {
        throw new Error('Invalid public ID');
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });

        // Cloudinary returns { result: 'ok' } on success or { result: 'not found' } if image doesn't exist
        if (result.result !== 'ok' && result.result !== 'not found') {
            throw new Error(`Failed to delete image: ${result.result}`);
        }
    } catch (error: any) {
        // Log the error but don't throw - we don't want to fail the profile update if deletion fails
        console.error(`Failed to delete image from Cloudinary (publicId: ${publicId}):`, error.message);
        throw error;
    }
};

/**
 * Delete old profile image from Cloudinary if it exists
 * This is a safe wrapper that won't throw errors
 * 
 * @param oldImageUrl - The URL of the old profile image
 */
export const deleteOldProfileImage = async (oldImageUrl: string | undefined): Promise<void> => {
    if (!oldImageUrl) {
        return; // No old image to delete
    }

    try {
        const publicId = extractPublicIdFromUrl(oldImageUrl);
        if (!publicId) {
            console.warn(`Could not extract public ID from URL: ${oldImageUrl}`);
            return;
        }

        await deleteImageFromCloudinary(publicId);
    } catch (error: any) {
        // Log but don't throw - we don't want to fail the profile update
        console.error(`Error deleting old profile image:`, error.message);
    }
};
