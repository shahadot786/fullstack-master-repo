import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeWebSocket = (token: string): Socket => {
  // If socket already exists and is connected, return it
  if (socket?.connected) {
    return socket;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000", {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("✅ WebSocket connected");
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ WebSocket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ WebSocket connection error:", error.message);
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
