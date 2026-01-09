import mongoose from "mongoose";
import { Conversation, Message, IConversation, IMessage, MessageType } from "./chat.model";
import User from "@services/auth/auth.model";
import { NotFoundError, ForbiddenError, BadRequestError } from "@common/errors";
import { emitToUser, getIO } from "@common/services/websocket.service";
import { GetMessagesQuery, GetConversationsQuery } from "./chat.validation";

// ============================================
// Conversation Operations
// ============================================

/**
 * Create or get an existing conversation
 */
export const createOrGetConversation = async (
    userId: string,
    participantIds: string[],
    type: "direct" | "group" = "direct",
    name?: string
): Promise<IConversation> => {
    // Add current user to participants if not already included
    const allParticipants = [...new Set([userId, ...participantIds])];
    
    // Prevent user from chatting with themselves
    if (type === "direct" && allParticipants.length < 2) {
        throw new BadRequestError("Cannot start a conversation with yourself");
    }

    const participantObjectIds = allParticipants.map(id => new mongoose.Types.ObjectId(id));

    // Validate all participants exist
    const users = await User.find({ _id: { $in: participantObjectIds } });
    if (users.length !== allParticipants.length) {
        throw new BadRequestError("One or more participants not found");
    }

    // For direct messages, check if conversation already exists
    if (type === "direct" && allParticipants.length === 2) {
        const existingConversation = await Conversation.findOne({
            type: "direct",
            participants: { $all: participantObjectIds, $size: 2 },
        }).populate("participants", "name email profileImage");

        if (existingConversation) {
            return existingConversation;
        }
    }

    // Create new conversation
    const conversation = await Conversation.create({
        participants: participantObjectIds,
        type,
        name: type === "group" ? name : undefined,
        createdBy: new mongoose.Types.ObjectId(userId),
    });

    // Populate participants
    await conversation.populate("participants", "name email profileImage");

    // Notify other participants about new conversation
    participantIds.forEach((participantId) => {
        emitToUser(participantId, "chat:new_conversation", { conversation });
    });

    return conversation;
};

/**
 * Get conversations for a user
 */
export const getConversations = async (
    userId: string,
    query: GetConversationsQuery
): Promise<{ conversations: IConversation[]; total: number }> => {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const filter = { participants: new mongoose.Types.ObjectId(userId) };

    const [conversations, total] = await Promise.all([
        Conversation.find(filter)
            .populate("participants", "name email profileImage")
            .populate("lastMessage.senderId", "name")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit),
        Conversation.countDocuments(filter),
    ]);

    return { conversations, total };
};

/**
 * Get conversation by ID
 */
export const getConversationById = async (
    userId: string,
    conversationId: string
): Promise<IConversation> => {
    const conversation = await Conversation.findById(conversationId)
        .populate("participants", "name email profileImage");

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
        (p: any) => p._id.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    return conversation;
};

/**
 * Update a conversation (name or image)
 */
export const updateConversation = async (
    userId: string,
    conversationId: string,
    data: { name?: string; image?: string }
): Promise<IConversation> => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    if (conversation.type !== "group") {
        throw new BadRequestError("Only group conversations can be updated");
    }

    if (data.name) {
        conversation.name = data.name;
    }
    
    if (data.image) {
        conversation.image = data.image;
    }

    await conversation.save();
    await conversation.populate("participants", "name email profileImage");

    // Notify other participants
    conversation.participants.forEach((participantId) => {
        emitToUser(participantId.toString(), "chat:conversation_updated", {
            conversation,
        });
    });

    return conversation;
};

/**
 * Leave or delete a conversation
 */
export const leaveConversation = async (
    userId: string,
    conversationId: string
): Promise<void> => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    if (conversation.type === "direct") {
        // For direct messages, soft delete by removing user from participants
        // If both users leave, delete the conversation
        conversation.participants = conversation.participants.filter(
            (p) => p.toString() !== userId
        );

        if (conversation.participants.length === 0) {
            await Conversation.findByIdAndDelete(conversationId);
            await Message.deleteMany({ conversationId });
        } else {
            await conversation.save();
        }
    } else {
        // For group chats, remove user from participants
        conversation.participants = conversation.participants.filter(
            (p) => p.toString() !== userId
        );

        if (conversation.participants.length < 2) {
            await Conversation.findByIdAndDelete(conversationId);
            await Message.deleteMany({ conversationId });
        } else {
            await conversation.save();

            // Notify remaining participants
            conversation.participants.forEach((participantId) => {
                emitToUser(participantId.toString(), "chat:user_left", {
                    conversationId,
                    userId,
                });
            });
        }
    }
};

// ============================================
// Message Operations
// ============================================

/**
 * Send a message
 */
export const sendMessage = async (
    userId: string,
    conversationId: string,
    content: string,
    messageType: MessageType = "text",
    imageUrl?: string,
    fileName?: string,
    fileSize?: number
): Promise<IMessage> => {
    // Verify conversation exists and user is participant
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    // Create message
    const message = await Message.create({
        conversationId,
        senderId: userId,
        content,
        messageType,
        imageUrl,
        fileName,
        fileSize,
        readBy: [{ userId: new mongoose.Types.ObjectId(userId), readAt: new Date() }],
    });

    // Populate sender info
    await message.populate("senderId", "name email profileImage");

    // Update conversation's last message
    conversation.lastMessage = {
        content: messageType === "text" ? content : (messageType === "image" ? "📷 Image" : "📎 File"),
        senderId: new mongoose.Types.ObjectId(userId),
        messageType,
        createdAt: new Date(),
    };
    await conversation.save();

    // Emit message to all participants via WebSocket
    conversation.participants.forEach((participantId) => {
        emitToUser(participantId.toString(), "chat:message", {
            message,
            conversationId,
        });
    });

    return message;
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
    userId: string,
    conversationId: string,
    query: GetMessagesQuery
): Promise<{ messages: IMessage[]; total: number; hasMore: boolean }> => {
    const { page = 1, limit = 50, before } = query;

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    // Build filter
    const filter: any = { conversationId, isDeleted: false };

    // For infinite scroll - get messages before a specific message
    if (before) {
        const beforeMessage = await Message.findById(before);
        if (beforeMessage) {
            filter.createdAt = { $lt: beforeMessage.createdAt };
        }
    }

    const skip = before ? 0 : (page - 1) * limit;

    const [messages, total] = await Promise.all([
        Message.find(filter)
            .populate("senderId", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1), // Get one extra to check if there are more
        Message.countDocuments({ conversationId, isDeleted: false }),
    ]);

    const hasMore = messages.length > limit;
    if (hasMore) {
        messages.pop(); // Remove the extra message
    }

    // Reverse to get chronological order
    return { messages: messages.reverse(), total, hasMore };
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
    userId: string,
    conversationId: string
): Promise<void> => {
    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }

    const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
    );

    if (!isParticipant) {
        throw new ForbiddenError("You are not a participant of this conversation");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Update all unread messages
    await Message.updateMany(
        {
            conversationId,
            isDeleted: false,
            "readBy.userId": { $ne: userObjectId },
        },
        {
            $push: {
                readBy: { userId: userObjectId, readAt: new Date() },
            },
        }
    );

    // Notify other participants about read status
    conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== userId) {
            emitToUser(participantId.toString(), "chat:read", {
                conversationId,
                userId,
                readAt: new Date(),
            });
        }
    });
};

/**
 * Delete a message (soft delete)
 */
export const deleteMessage = async (
    userId: string,
    messageId: string
): Promise<void> => {
    const message = await Message.findById(messageId);

    if (!message) {
        throw new NotFoundError("Message not found");
    }

    // Only sender can delete their message
    if (message.senderId.toString() !== userId) {
        throw new ForbiddenError("You can only delete your own messages");
    }

    message.isDeleted = true;
    message.content = "This message was deleted";
    message.imageUrl = undefined;
    message.fileName = undefined;
    await message.save();

    // Get conversation to notify participants
    const conversation = await Conversation.findById(message.conversationId);

    if (conversation) {
        conversation.participants.forEach((participantId) => {
            emitToUser(participantId.toString(), "chat:message_deleted", {
                messageId,
                conversationId: message.conversationId,
            });
        });
    }
};

/**
 * Get unread message count for a user
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({ participants: userObjectId });

    const conversationIds = conversations.map((c) => c._id);

    // Count unread messages
    const count = await Message.countDocuments({
        conversationId: { $in: conversationIds },
        senderId: { $ne: userObjectId },
        isDeleted: false,
        "readBy.userId": { $ne: userObjectId },
    });

    return count;
};

/**
 * Emit typing indicator
 */
export const emitTypingIndicator = (
    userId: string,
    conversationId: string,
    isTyping: boolean
): void => {
    // Get conversation to find other participants (we'll do this async)
    Conversation.findById(conversationId).then((conversation) => {
        if (conversation) {
            conversation.participants.forEach((participantId) => {
                if (participantId.toString() !== userId) {
                    emitToUser(participantId.toString(), "chat:typing", {
                        conversationId,
                        userId,
                        isTyping,
                    });
                }
            });
        }
    });
};
