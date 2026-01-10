import { Response } from "express";
import * as shoutboxService from "./shoutbox.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

/**
 * Send a shoutbox message
 */
export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { content } = req.body;

    const message = await shoutboxService.sendMessage(userId, content);

    sendSuccess(res, message, "Message sent", HTTP_STATUS.CREATED);
});

/**
 * Get shoutbox messages
 */
export const getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { messages, hasMore } = await shoutboxService.getMessages(req.query as any);

    res.status(HTTP_STATUS.OK).json({
        success: true,
        data: messages,
        pagination: {
            hasMore,
        },
    });
});

/**
 * Get message count
 */
export const getMessageCount = asyncHandler(async (req: AuthRequest, res: Response) => {
    const count = await shoutboxService.getMessageCount();

    sendSuccess(res, { count });
});
