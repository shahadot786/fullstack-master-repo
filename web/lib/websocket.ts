import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeWebSocket = (token?: string): Socket => {
  // If socket already exists and is connected, return it
  if (socket?.connected) {
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  const socketOptions: any = {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    withCredentials: true, // Send cookies with WebSocket connection
  };

  // Add token to auth if provided (for backward compatibility)
  if (token) {
    socketOptions.auth = { token };
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000", socketOptions);

  // Connection event handlers
  socket.on("connect", () => {
    // Connected
  });

  socket.on("disconnect", (reason) => {
    // Disconnected
  });

  socket.on("connect_error", (error) => {
    // Connection error
  });

  return socket;
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

export default {
  initialize: initializeWebSocket,
  disconnect: disconnectWebSocket,
  getSocket,
};
