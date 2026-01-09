import { Router } from "express";
import * as controller from "./chat.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validation.middleware";
import {
    createConversationValidation,
    getConversationValidation,
    getConversationsValidation,
    sendMessageValidation,
    getMessagesValidation,
    markAsReadValidation,
    deleteMessageValidation,
    updateConversationValidation,
} from "./chat.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat and messaging endpoints
 */

// ============================================
// Conversation Routes
// ============================================

/**
 * @swagger
 * /api/chat/conversations:
 *   post:
 *     summary: Create or get existing conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantIds
 *             properties:
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: User IDs to add to the conversation
 *               type:
 *                 type: string
 *                 enum: [direct, group]
 *                 default: direct
 *               name:
 *                 type: string
 *                 description: Name for group conversations
 *     responses:
 *       201:
 *         description: Conversation created or retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/conversations",
    validate(createConversationValidation),
    controller.createConversation
);

/**
 * @swagger
 * /api/chat/conversations:
 *   get:
 *     summary: Get all conversations for the current user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/conversations",
    validate(getConversationsValidation),
    controller.getConversations
);

/**
 * @swagger
 * /api/chat/unread:
 *   get:
 *     summary: Get unread message count
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/unread", controller.getUnreadCount);

/**
 * @swagger
 * /api/chat/conversations/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.get(
    "/conversations/:id",
    validate(getConversationValidation),
    controller.getConversationById
);

/**
 * @swagger
 * /api/chat/conversations/{id}:
 *   patch:
 *     summary: Update a conversation (name or image)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the conversation
 *               image:
 *                 type: string
 *                 description: New image URL for the conversation
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.patch(
    "/conversations/:id",
    validate(updateConversationValidation),
    controller.updateConversation
);

/**
 * @swagger
 * /api/chat/conversations/{id}:
 *   delete:
 *     summary: Leave or delete a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Left conversation successfully
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.delete(
    "/conversations/:id",
    validate(getConversationValidation),
    controller.leaveConversation
);

// ============================================
// Message Routes
// ============================================

/**
 * @swagger
 * /api/chat/conversations/{id}/messages:
 *   post:
 *     summary: Send a message to a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file]
 *                 default: text
 *               imageUrl:
 *                 type: string
 *                 description: URL of the uploaded image (for image messages)
 *               fileName:
 *                 type: string
 *                 description: Original file name (for file messages)
 *               fileSize:
 *                 type: number
 *                 description: File size in bytes (for file messages)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid message format
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.post(
    "/conversations/:id/messages",
    validate(sendMessageValidation),
    controller.sendMessage
);

/**
 * @swagger
 * /api/chat/conversations/{id}/messages:
 *   get:
 *     summary: Get messages for a conversation
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Message ID to get messages before (for infinite scroll)
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.get(
    "/conversations/:id/messages",
    validate(getMessagesValidation),
    controller.getMessages
);

/**
 * @swagger
 * /api/chat/conversations/{id}/read:
 *   put:
 *     summary: Mark all messages in a conversation as read
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       403:
 *         description: Not a participant
 *       404:
 *         description: Conversation not found
 */
router.put(
    "/conversations/:id/read",
    validate(markAsReadValidation),
    controller.markAsRead
);

/**
 * @swagger
 * /api/chat/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Message deleted successfully
 *       403:
 *         description: Cannot delete others' messages
 *       404:
 *         description: Message not found
 */
router.delete(
    "/messages/:id",
    validate(deleteMessageValidation),
    controller.deleteMessage
);

export default router;
