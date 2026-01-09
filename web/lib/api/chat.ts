import apiClient from "./client";
import {
  Conversation,
  Message,
  CreateConversationDto,
  SendMessageDto,
  ConversationsResponse,
  MessagesResponse,
  ChatQueryParams,
} from "@/types";

const CHAT_API = "/chat";

/**
 * Chat API Client
 */
export const chatApi = {
  /**
   * Create or get existing conversation
   */
  createConversation: async (data: CreateConversationDto): Promise<Conversation> => {
    const response = await apiClient.post(`${CHAT_API}/conversations`, data);
    return response.data.data;
  },

  /**
   * Get all conversations for the current user
   */
  getConversations: async (params?: ChatQueryParams): Promise<ConversationsResponse> => {
    const response = await apiClient.get(`${CHAT_API}/conversations`, { params });
    return response.data;
  },

  /**
   * Get conversation by ID
   */
  getConversationById: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get(`${CHAT_API}/conversations/${id}`);
    return response.data.data;
  },

  /**
   * Leave or delete a conversation
   */
  leaveConversation: async (id: string): Promise<void> => {
    await apiClient.delete(`${CHAT_API}/conversations/${id}`);
  },

  /**
   * Send a message to a conversation
   */
  sendMessage: async (conversationId: string, data: SendMessageDto): Promise<Message> => {
    const response = await apiClient.post(
      `${CHAT_API}/conversations/${conversationId}/messages`,
      data
    );
    return response.data.data;
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (
    conversationId: string,
    params?: ChatQueryParams
  ): Promise<MessagesResponse> => {
    const response = await apiClient.get(
      `${CHAT_API}/conversations/${conversationId}/messages`,
      { params }
    );
    return response.data;
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId: string): Promise<void> => {
    await apiClient.put(`${CHAT_API}/conversations/${conversationId}/read`);
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: string): Promise<void> => {
    await apiClient.delete(`${CHAT_API}/messages/${messageId}`);
  },

  /**
   * Update a conversation (name or image)
   */
  updateConversation: async (
    id: string,
    data: { name?: string; image?: string }
  ): Promise<Conversation> => {
    const response = await apiClient.patch(`${CHAT_API}/conversations/${id}`, data);
    return response.data.data;
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get(`${CHAT_API}/unread`);
    return response.data.data.count;
  },
};

export default chatApi;
