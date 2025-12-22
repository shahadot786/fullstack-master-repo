import mongoose, { Schema, Document } from 'mongoose';

export interface IUpload extends Document {
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    resourceType: 'image' | 'video' | 'raw';
    bytes: number;
    width?: number;
    height?: number;
    uploadedBy: mongoose.Types.ObjectId;
    folder: string;
    originalFilename?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UploadSchema = new Schema<IUpload>(
    {
        publicId: {
            type: String,
            required: [true, 'Public ID is required'],
            unique: true,
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
        },
        secureUrl: {
            type: String,
            required: [true, 'Secure URL is required'],
        },
        format: {
            type: String,
            required: [true, 'Format is required'],
        },
        resourceType: {
            type: String,
            enum: ['image', 'video', 'raw'],
            required: [true, 'Resource type is required'],
        },
        bytes: {
            type: Number,
            required: [true, 'File size is required'],
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uploaded by user is required'],
        },
        folder: {
            type: String,
            default: 'uploads',
        },
        originalFilename: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
UploadSchema.index({ uploadedBy: 1, createdAt: -1 });

export default mongoose.model<IUpload>('Upload', UploadSchema);
