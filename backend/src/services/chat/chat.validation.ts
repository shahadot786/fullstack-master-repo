import { z } from "zod";

// ============================================
// Conversation Validations
// ============================================

export const createConversationValidation = z.object({
    body: z.object({
        participantIds: z
            .array(z.string().min(1, "Participant ID is required"))
            .min(1, "At least one participant is required")
            .max(50, "Maximum 50 participants allowed"),
        type: z.enum(["direct", "group"]).optional().default("direct"),
        name: z.string().max(100, "Name cannot exceed 100 characters").optional(),
    }),
});

export const getConversationValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Conversation ID is required"),
    }),
});

export const getConversationsValidation = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().max(50).optional().default(20),
    }),
});

// ============================================
// Message Validations
// ============================================

export const sendMessageValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Conversation ID is required"),
    }),
    body: z.object({
        content: z.string().max(5000, "Message cannot exceed 5000 characters").optional().default(""),
        messageType: z.enum(["text", "image", "file"]).optional().default("text"),
        imageUrl: z.string().url("Invalid image URL").optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
    }).refine(
        (data) => {
            // For text messages, content is required
            if (data.messageType === "text" && !data.content?.trim()) {
                return false;
            }
            // For image messages, imageUrl is required
            if (data.messageType === "image" && !data.imageUrl) {
                return false;
            }
            return true;
        },
        {
            message: "Text messages require content, image messages require imageUrl",
        }
    ),
});

export const getMessagesValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Conversation ID is required"),
    }),
    query: z.object({
        page: z.coerce.number().int().positive().optional().default(1),
        limit: z.coerce.number().int().positive().max(100).optional().default(50),
        before: z.string().optional(), // Message ID to get messages before (for infinite scroll)
    }),
});

export const markAsReadValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Conversation ID is required"),
    }),
});

export const deleteMessageValidation = z.object({
    params: z.object({
        id: z.string().min(1, "Message ID is required"),
    }),
});

// ============================================
// WebSocket Event Validations
// ============================================

export const typingEventValidation = z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    isTyping: z.boolean(),
});

// Export types
export type CreateConversationInput = z.infer<typeof createConversationValidation>["body"];
export type SendMessageInput = z.infer<typeof sendMessageValidation>["body"];
export type GetMessagesQuery = z.infer<typeof getMessagesValidation>["query"];
export type GetConversationsQuery = z.infer<typeof getConversationsValidation>["query"];
