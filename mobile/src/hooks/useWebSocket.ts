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
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoUpdated = ({ todo }: { todo: Todo }) => {
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoDeleted = ({ todoId }: { todoId: string }) => {
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodosDeletedAll = () => {
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("todo:created", handleTodoCreated);
    socket.on("todo:updated", handleTodoUpdated);
    socket.on("todo:deleted", handleTodoDeleted);
    socket.on("todos:deleted_all", handleTodosDeletedAll);

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
    };
  }, [accessToken, user, queryClient]);

  return {
    isConnected,
    socket: getSocket(),
  };
};
