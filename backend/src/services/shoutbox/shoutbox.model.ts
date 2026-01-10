import mongoose, { Schema, Document } from "mongoose";

/**
 * Shoutbox Message Interface
 * Public messages visible to all authenticated users
 */
export interface IShoutboxMessage extends Document {
    _id: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Shoutbox Message Schema
 */
const ShoutboxMessageSchema: Schema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 500,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
ShoutboxMessageSchema.index({ createdAt: -1 });

// Auto-delete messages older than 24 hours (optional - can be enabled)
// ShoutboxMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const ShoutboxMessage = mongoose.model<IShoutboxMessage>("ShoutboxMessage", ShoutboxMessageSchema);
