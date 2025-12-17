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
    console.log("🔄 useWebSocket effect triggered", { 
      hasToken: !!accessToken, 
      hasUser: !!user 
    });

    // Only connect if user is authenticated
    if (!accessToken || !user) {
      console.log("⚠️ No auth, disconnecting WebSocket");
      disconnectWebSocket();
      setIsConnected(false);
      return;
    }

    // Initialize WebSocket connection
    console.log("🔌 Initializing WebSocket in hook");
    const socket = initializeWebSocket(accessToken);

    // Update connection status
    const handleConnect = () => {
      console.log("✅ WebSocket connected - updating state");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ WebSocket disconnected - updating state");
      setIsConnected(false);
    };

    // Listen to todo events and update React Query cache
    const handleTodoCreated = ({ todo }: { todo: Todo }) => {
      console.log("📥 [MOBILE] Todo created event received:", todo._id);
      
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoUpdated = ({ todo }: { todo: Todo }) => {
      console.log("📥 [MOBILE] Todo updated event received:", todo._id);
      
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoDeleted = ({ todoId }: { todoId: string }) => {
      console.log("📥 [MOBILE] Todo deleted event received:", todoId);
      
      // Invalidate todos query to refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodosDeletedAll = () => {
      console.log("📥 [MOBILE] All todos deleted event received");
      
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
    const initialStatus = socket.connected;
    console.log("📊 Initial socket status:", initialStatus);
    setIsConnected(initialStatus);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up WebSocket listeners");
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
