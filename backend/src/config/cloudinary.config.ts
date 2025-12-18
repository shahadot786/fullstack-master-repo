import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

/**
 * Cloudinary Configuration
 * 
 * Configure Cloudinary with environment variables
 */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Verify configuration on initialization
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('⚠️  Cloudinary credentials not configured. Upload functionality will not work.');
}

export default cloudinary;
