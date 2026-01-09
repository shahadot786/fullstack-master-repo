import mongoose from "mongoose";
import { ShoutboxMessage, IShoutboxMessage } from "./shoutbox.model";
import { getIO } from "@common/services/websocket.service";
import { GetShoutboxMessagesQuery } from "./shoutbox.validation";

/**
 * Send a shoutbox message (visible to all users)
 */
export const sendMessage = async (
    userId: string,
    content: string
): Promise<IShoutboxMessage> => {
    const message = await ShoutboxMessage.create({
        senderId: new mongoose.Types.ObjectId(userId),
        content,
    });

    // Populate sender info
    await message.populate("senderId", "name email profileImage");

    // Broadcast to all connected users via WebSocket
    const io = getIO();
    io.emit("shoutbox:message", { message });

    return message;
};

/**
 * Get shoutbox messages (paginated, newest first)
 */
export const getMessages = async (
    query: GetShoutboxMessagesQuery
): Promise<{ messages: IShoutboxMessage[]; hasMore: boolean }> => {
    const { limit = 50, before } = query;

    // Build filter for pagination
    const filter: any = {};

    if (before) {
        const beforeMessage = await ShoutboxMessage.findById(before);
        if (beforeMessage) {
            filter.createdAt = { $lt: beforeMessage.createdAt };
        }
    }

    const messages = await ShoutboxMessage.find(filter)
        .populate("senderId", "name email profileImage")
        .sort({ createdAt: -1 })
        .limit(limit + 1); // Get one extra to check if there are more

    const hasMore = messages.length > limit;
    if (hasMore) {
        messages.pop(); // Remove the extra message
    }

    // Return in chronological order (newest last for display)
    return { messages: messages.reverse(), hasMore };
};

/**
 * Get total message count
 */
export const getMessageCount = async (): Promise<number> => {
    return ShoutboxMessage.countDocuments();
};

/**
 * Delete old messages (cleanup - can be used in a cron job)
 */
export const deleteOldMessages = async (hoursOld: number = 24): Promise<number> => {
    const cutoff = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    const result = await ShoutboxMessage.deleteMany({ createdAt: { $lt: cutoff } });
    return result.deletedCount;
};
