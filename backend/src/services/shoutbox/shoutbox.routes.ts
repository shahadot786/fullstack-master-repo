import { Router } from "express";
import * as controller from "./shoutbox.controller";
import { authenticate } from "@middleware/auth.middleware";
import { validate } from "@middleware/validation.middleware";
import {
    sendShoutboxMessageValidation,
    getShoutboxMessagesValidation,
} from "./shoutbox.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Shoutbox
 *   description: Public shoutbox - open chat visible to all users
 */

/**
 * @swagger
 * /api/shoutbox/messages:
 *   post:
 *     summary: Send a message to the public shoutbox
 *     description: Post a message that will be visible to all authenticated users
 *     tags: [Shoutbox]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 500
 *                 description: Message content (max 500 characters)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid message
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/messages",
    validate(sendShoutboxMessageValidation),
    controller.sendMessage
);

/**
 * @swagger
 * /api/shoutbox/messages:
 *   get:
 *     summary: Get shoutbox messages
 *     description: Retrieve public shoutbox messages with pagination
 *     tags: [Shoutbox]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *         description: Number of messages to return
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Message ID to get messages before (for infinite scroll)
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/messages",
    validate(getShoutboxMessagesValidation),
    controller.getMessages
);

/**
 * @swagger
 * /api/shoutbox/count:
 *   get:
 *     summary: Get total message count
 *     tags: [Shoutbox]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/count", controller.getMessageCount);

export default router;
