import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { initializeWebSocket, disconnectWebSocket, getSocket } from "@/services/websocket.service";
import { Todo, Message, ShoutboxMessage } from "@/types";

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
      console.log("🔌 WebSocket Connected");
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log("🔌 WebSocket Disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.log("🔌 WebSocket Connection Error:", error.message);
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
    const handleNewMessage = ({ message, conversationId }: { message: Message; conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      
      // Show in-app notification if message is from another user
      const sender = typeof message.senderId === 'object' ? message.senderId : null;
      if (sender && sender._id !== user._id) {
        useNotificationStore.getState().showNotification({
          type: 'chat',
          title: sender.name || 'New Message',
          message: message.content || 'Sent an attachment',
          senderName: sender.name || 'Unknown',
          senderImage: sender.profileImage,
          conversationId,
        });
      }
    };

    const handleNewConversation = ({ conversation }: { conversation: any }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    // Shoutbox Events
    const handleShoutboxMessage = ({ message }: { message: ShoutboxMessage }) => {
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
      
      // Show in-app notification if message is from another user
      const sender = typeof message.senderId === 'object' ? message.senderId : null;
      if (sender && sender._id !== user._id) {
        useNotificationStore.getState().showNotification({
          type: 'shoutbox',
          title: 'Shoutbox',
          message: `${sender.name}: ${message.content}`,
          senderName: sender.name || 'Unknown',
          senderImage: sender.profileImage,
        });
      }
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
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
      socket.off("connect_error", handleConnectError);
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
