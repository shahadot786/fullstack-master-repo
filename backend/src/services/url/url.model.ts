import mongoose, { Schema, Document } from "mongoose";

export interface IUrl extends Document {
    userId: mongoose.Types.ObjectId;
    originalUrl: string;
    shortId: string;
    clicks: number;
    title?: string;
    lastClickedAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const urlSchema = new Schema<IUrl>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        originalUrl: {
            type: String,
            required: true,
        },
        shortId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        title: {
            type: String,
        },
        lastClickedAt: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add unique index on userId and originalUrl to avoid duplicates for the same user
// Optional: If you want to allow same URL multiple times, remove this.
// urlSchema.index({ userId: 1, originalUrl: 1 }, { unique: true });

const Url = mongoose.model<IUrl>("Url", urlSchema);

export default Url;
