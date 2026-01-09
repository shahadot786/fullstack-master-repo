import { Response } from "express";
import * as chatService from "./chat.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess, sendPaginated } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

// ============================================
// Conversation Controllers
// ============================================

/**
 * Create or get existing conversation
 */
export const createConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { participantIds, type, name } = req.body;

    const conversation = await chatService.createOrGetConversation(
        userId,
        participantIds,
        type,
        name
    );

    sendSuccess(res, conversation, "Conversation created successfully", HTTP_STATUS.CREATED);
});

/**
 * Get all conversations for the current user
 */
export const getConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { conversations, total } = await chatService.getConversations(userId, req.query as any);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    sendPaginated(res, conversations, page, limit, total);
});

/**
 * Get conversation by ID
 */
export const getConversationById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const conversation = await chatService.getConversationById(userId, req.params.id);

    sendSuccess(res, conversation);
});

/**
 * Leave or delete a conversation
 */
export const leaveConversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await chatService.leaveConversation(userId, req.params.id);

    sendSuccess(res, null, "Left conversation successfully", HTTP_STATUS.NO_CONTENT);
});

// ============================================
// Message Controllers
// ============================================

/**
 * Send a message to a conversation
 */
export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { content, messageType, imageUrl, fileName, fileSize } = req.body;

    const message = await chatService.sendMessage(
        userId,
        req.params.id,
        content,
        messageType,
        imageUrl,
        fileName,
        fileSize
    );

    sendSuccess(res, message, "Message sent successfully", HTTP_STATUS.CREATED);
});

/**
 * Get messages for a conversation
 */
export const getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { messages, total, hasMore } = await chatService.getMessages(
        userId,
        req.params.id,
        req.query as any
    );

    res.status(HTTP_STATUS.OK).json({
        success: true,
        data: messages,
        pagination: {
            total,
            hasMore,
        },
    });
});

/**
 * Mark messages as read
 */
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await chatService.markMessagesAsRead(userId, req.params.id);

    sendSuccess(res, null, "Messages marked as read");
});

/**
 * Delete a message
 */
export const deleteMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    await chatService.deleteMessage(userId, req.params.id);

    sendSuccess(res, null, "Message deleted successfully", HTTP_STATUS.NO_CONTENT);
});

/**
 * Get unread message count
 */
export const getUnreadCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const count = await chatService.getUnreadCount(userId);

    sendSuccess(res, { count });
});
