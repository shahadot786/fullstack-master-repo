import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import {
  Message,
  CreateConversationDto,
  SendMessageDto,
  ChatQueryParams,
  MessagesResponse,
} from "@/types";

// Query Keys
const CHAT_KEYS = {
  conversations: ["conversations"] as const,
  conversation: (id: string) => ["conversation", id] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,
  unreadCount: ["unreadCount"] as const,
};

/**
 * Hook to get all conversations
 */
export const useConversations = (params?: ChatQueryParams) => {
  return useQuery({
    queryKey: [...CHAT_KEYS.conversations, params],
    queryFn: () => chatApi.getConversations(params),
  });
};

/**
 * Hook to get conversations with infinite scroll
 */
export const useInfiniteConversations = () => {
  return useInfiniteQuery({
    queryKey: CHAT_KEYS.conversations,
    queryFn: ({ pageParam = 1 }) =>
      chatApi.getConversations({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

/**
 * Hook to get a single conversation
 */
export const useConversation = (id: string) => {
  return useQuery({
    queryKey: CHAT_KEYS.conversation(id),
    queryFn: () => chatApi.getConversationById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get messages with infinite scroll
 */
export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: CHAT_KEYS.messages(conversationId),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      chatApi.getMessages(conversationId, { before: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: MessagesResponse) => {
      if (!lastPage.pagination.hasMore || lastPage.data.length === 0) {
        return undefined;
      }
      // Return the ID of the oldest message for cursor-based pagination
      return lastPage.data[0]?._id;
    },
    enabled: !!conversationId,
  });
};

/**
 * Hook to get unread message count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: CHAT_KEYS.unreadCount,
    queryFn: () => chatApi.getUnreadCount(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

/**
 * Hook to create a conversation
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationDto) => chatApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
  });
};

/**
 * Hook to send a message
 */
export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageDto) => chatApi.sendMessage(conversationId, data),
    onSuccess: (newMessage: Message) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(conversationId) });
      // Invalidate conversations to update last message
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
  });
};

/**
 * Hook to mark messages as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.unreadCount });
    },
  });
};

/**
 * Hook to delete a message
 */
export const useDeleteMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chatApi.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(conversationId) });
    },
  });
};

/**
 * Hook to leave a conversation
 */
export const useLeaveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatApi.leaveConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_KEYS.conversations });
    },
  });
};
