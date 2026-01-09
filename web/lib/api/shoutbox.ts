import apiClient from "./client";

const SHOUTBOX_API = "/shoutbox";

export interface ShoutboxMessage {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    profileImage?: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

export const shoutboxApi = {
  /**
   * Send a shoutbox message
   */
  sendMessage: async (content: string): Promise<ShoutboxMessage> => {
    const response = await apiClient.post(`${SHOUTBOX_API}/messages`, { content });
    return response.data.data;
  },

  /**
   * Get shoutbox messages
   */
  getMessages: async (params?: {
    limit?: number;
    before?: string;
  }): Promise<{ data: ShoutboxMessage[]; pagination: { hasMore: boolean } }> => {
    const response = await apiClient.get(`${SHOUTBOX_API}/messages`, { params });
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  /**
   * Get total message count
   */
  getMessageCount: async (): Promise<number> => {
    const response = await apiClient.get(`${SHOUTBOX_API}/count`);
    return response.data.data.count;
  },
};
