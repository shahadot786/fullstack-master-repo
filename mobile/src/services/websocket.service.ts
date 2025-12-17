import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/config/constants";

let socket: Socket | null = null;

// Remove /api suffix from API_BASE_URL for WebSocket connection
const WEBSOCKET_URL = API_BASE_URL.replace('/api', '');

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
  console.log("🔌 Initializing WebSocket connection to:", WEBSOCKET_URL);
  socket = io(WEBSOCKET_URL, {
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
    console.log("✅ WebSocket connected to:", WEBSOCKET_URL);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ WebSocket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ WebSocket connection error:", error.message);
    console.error("   Attempted URL:", WEBSOCKET_URL);
    console.error("   Error details:", error);
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
