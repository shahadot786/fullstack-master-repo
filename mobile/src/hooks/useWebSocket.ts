import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { initializeWebSocket, disconnectWebSocket, getSocket } from "@/services/websocket.service";
import { Todo } from "@/types";

/**
 * WebSocket Hook
 * 
 * Manages WebSocket connection and real-time todo updates.
 * Automatically connects/disconnects based on authentication state.
 */

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!accessToken || !user) {
      disconnectWebSocket();
      setIsConnected(false);
      return;
    }

    // Initialize WebSocket connection
    const socket = initializeWebSocket(accessToken);

    // Update connection status
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Listen to todo events and update React Query cache
    const handleTodoCreated = ({ todo }: { todo: Todo }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoUpdated = ({ todo }: { todo: Todo }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoDeleted = ({ todoId }: { todoId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodosDeletedAll = () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    // Chat Events
    const handleNewMessage = ({ message, conversationId }: { message: any; conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleNewConversation = ({ conversation }: { conversation: any }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    // Shoutbox Events
    const handleShoutboxMessage = ({ message }: { message: any }) => {
      queryClient.setQueryData(["shoutbox-messages"], (oldData: any) => {
        if (!oldData) return undefined;
        
        const pages = [...oldData.pages];
        const lastPageIndex = pages.length - 1;
        
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

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("todo:created", handleTodoCreated);
    socket.on("todo:updated", handleTodoUpdated);
    socket.on("todo:deleted", handleTodoDeleted);
    socket.on("todos:deleted_all", handleTodosDeletedAll);
    
    // Chat & Shoutbox
    socket.on("chat:message", handleNewMessage);
    socket.on("chat:new_conversation", handleNewConversation);
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
      
      socket.off("chat:message", handleNewMessage);
      socket.off("chat:new_conversation", handleNewConversation);
      socket.off("shoutbox:message", handleShoutboxMessage);
    };
  }, [accessToken, user, queryClient]);

  return {
    isConnected,
    socket: getSocket(),
  };
};
