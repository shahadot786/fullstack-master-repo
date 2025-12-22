"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { initializeWebSocket, disconnectWebSocket, getSocket } from "@/lib/websocket";
import { Todo } from "@/types";

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

    // Listen to todo events and update React Query cache
    const handleTodoCreated = ({ todo }: { todo: Todo }) => {
      // Add new todo to the cache
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [todo];
        return [todo, ...oldData];
      });

      // Invalidate to trigger re-render
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoUpdated = ({ todo }: { todo: Todo }) => {
      // Update todo in the cache
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [todo];
        return oldData.map((t) => (t._id === todo._id ? todo : t));
      });

      // Invalidate to trigger re-render
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodoDeleted = ({ todoId }: { todoId: string }) => {
      // Remove todo from the cache
      queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((t) => t._id !== todoId);
      });

      // Invalidate to trigger re-render
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    };

    const handleTodosDeletedAll = () => {
      // Clear all todos from the cache
      queryClient.setQueryData(["todos"], []);

      // Invalidate to trigger re-render
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
  }, [isAuthenticated, user, queryClient]);

  return {
    isConnected,
    socket: getSocket(),
  };
};
