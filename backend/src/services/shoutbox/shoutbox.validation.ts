import { z } from "zod";

/**
 * Send shoutbox message validation
 */
export const sendShoutboxMessageValidation = z.object({
    body: z.object({
        content: z
            .string()
            .min(1, "Message cannot be empty")
            .max(500, "Message cannot exceed 500 characters")
            .trim(),
    }),
});

/**
 * Get shoutbox messages validation
 */
export const getShoutboxMessagesValidation = z.object({
    query: z.object({
        limit: z.coerce.number().int().positive().max(100).optional().default(50),
        before: z.string().optional(), // Message ID to get messages before (for infinite scroll)
    }),
});

// Export types
export type SendShoutboxMessageInput = z.infer<typeof sendShoutboxMessageValidation>["body"];
export type GetShoutboxMessagesQuery = z.infer<typeof getShoutboxMessagesValidation>["query"];
