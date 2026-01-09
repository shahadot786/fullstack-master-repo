"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { initializeWebSocket, disconnectWebSocket, getSocket } from "@/lib/websocket";
import { Todo, Message, Conversation } from "@/types";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !user) {
      disconnectWebSocket();
      setIsConnected(false);
      return;
    }

    // Initialize WebSocket connection (cookies will be sent automatically)
    const socket = initializeWebSocket();

    // Update connection status
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // ============================================
    // Todo Event Handlers
    // ============================================

    const handleTodoCreated = ({ todo }: { todo: Todo }) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [todo];
        return [todo, ...oldData];
      });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoUpdated = ({ todo }: { todo: Todo }) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [todo];
        return oldData.map((t) => (t._id === todo._id ? todo : t));
      });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoDeleted = ({ todoId }: { todoId: string }) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((t) => t._id !== todoId);
      });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodosDeletedAll = () => {
      queryClient.setQueryData(["todos"], []);
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    // ============================================
    // Chat Event Handlers
    // ============================================

    const handleNewMessage = ({ message, conversationId }: { message: Message; conversationId: string }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleNewConversation = ({ conversation }: { conversation: Conversation }) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleMessageRead = ({ conversationId, userId, readAt }: { conversationId: string; userId: string; readAt: Date }) => {
      // Invalidate messages to update read receipts
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    const handleMessageDeleted = ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    const handleUserLeft = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      // Invalidate conversation details
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleTyping = ({ conversationId, userId, isTyping }: { conversationId: string; userId: string; isTyping: boolean }) => {
      // Could dispatch to a typing indicator state if needed
      console.log(`User ${userId} is ${isTyping ? "typing" : "stopped typing"} in ${conversationId}`);
    };

    const handleShoutboxMessage = ({ message }: { message: any }) => {
      queryClient.setQueryData(["shoutbox-messages"], (oldData: any) => {
        if (!oldData) return undefined;
        
        const pages = [...oldData.pages];
        const lastPageIndex = pages.length - 1;
        
        // Avoid duplicates if the message was already added via mutation or another broadcast
        const exists = pages.some((page: any) => 
          page.data.some((m: any) => m._id === message._id)
        );
        if (exists) return oldData;

        pages[lastPageIndex] = {
          ...pages[lastPageIndex],
          data: [...pages[lastPageIndex].data, message],
        };

        return {
          ...oldData,
          pages,
        };
      });
      queryClient.invalidateQueries({ queryKey: ["shoutbox-messages"] });
    };

    // Register todo event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("todo:created", handleTodoCreated);
    socket.on("todo:updated", handleTodoUpdated);
    socket.on("todo:deleted", handleTodoDeleted);
    socket.on("todos:deleted_all", handleTodosDeletedAll);

    // Register chat event listeners
    socket.on("chat:message", handleNewMessage);
    socket.on("chat:new_conversation", handleNewConversation);
    socket.on("chat:read", handleMessageRead);
    socket.on("chat:message_deleted", handleMessageDeleted);
    socket.on("chat:user_left", handleUserLeft);
    socket.on("chat:typing", handleTyping);
    socket.on("shoutbox:message", handleShoutboxMessage);

    // Set initial connection status
    setIsConnected(socket.connected);

    // Cleanup on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("todo:created", handleTodoCreated);
      socket.off("todo:updated", handleTodoUpdated);
      socket.off("todo:deleted", handleTodoDeleted);
      socket.off("todos:deleted_all", handleTodosDeletedAll);
      // Chat event cleanup
      socket.off("chat:message", handleNewMessage);
      socket.off("chat:new_conversation", handleNewConversation);
      socket.off("chat:read", handleMessageRead);
      socket.off("chat:message_deleted", handleMessageDeleted);
      socket.off("chat:user_left", handleUserLeft);
      socket.off("chat:typing", handleTyping);
      socket.off("shoutbox:message", handleShoutboxMessage);
    };
  }, [isAuthenticated, user, queryClient]);

  return {
    isConnected,
    socket: getSocket(),
  };
};

