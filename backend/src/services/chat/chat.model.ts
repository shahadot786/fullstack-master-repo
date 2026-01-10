import mongoose, { Schema, Document } from "mongoose";

// ============================================
// Message Types
// ============================================

export type MessageType = "text" | "image" | "file";

export interface IReadReceipt {
    userId: mongoose.Types.ObjectId;
    readAt: Date;
}

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    content: string;
    messageType: MessageType;
    imageUrl?: string;
    fileName?: string;
    fileSize?: number;
    readBy: IReadReceipt[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReadReceiptSchema = new Schema<IReadReceipt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        readAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "Conversation ID is required"],
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender ID is required"],
        },
        content: {
            type: String,
            trim: true,
            maxlength: [5000, "Message cannot exceed 5000 characters"],
            default: "",
        },
        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        fileName: {
            type: String,
            trim: true,
        },
        fileSize: {
            type: Number,
        },
        readBy: {
            type: [ReadReceiptSchema],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for efficient queries
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, senderId: 1 });

// ============================================
// Conversation Types
// ============================================

export type ConversationType = "direct" | "group";

export interface ILastMessage {
    content: string;
    senderId: mongoose.Types.ObjectId;
    messageType: MessageType;
    createdAt: Date;
}

export interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    type: ConversationType;
    name?: string;
    image?: string;
    lastMessage?: ILastMessage;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LastMessageSchema = new Schema<ILastMessage>(
    {
        content: {
            type: String,
            trim: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
        type: {
            type: String,
            enum: ["direct", "group"],
            default: "direct",
        },
        name: {
            type: String,
            trim: true,
            maxlength: [100, "Conversation name cannot exceed 100 characters"],
        },
        image: {
            type: String,
            trim: true,
        },
        lastMessage: {
            type: LastMessageSchema,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({ "participants": 1, "type": 1 });

// Pre-save middleware to validate direct conversations have exactly 2 participants
ConversationSchema.pre("save", async function () {
    if (this.type === "direct" && this.participants.length !== 2) {
        throw new Error("Direct conversations must have exactly 2 participants");
    } else if (this.type === "group" && this.participants.length < 2) {
        throw new Error("Group conversations must have at least 2 participants");
    }
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
