import { io, Socket } from "socket.io-client";
import { API_BASE_URL_PRODUCTION } from "@/config/constants";

let socket: Socket | null = null;
let currentToken: string | null = null;

// Remove /api suffix from API_BASE_URL_PRODUCTION for WebSocket connection
const WEBSOCKET_URL = API_BASE_URL_PRODUCTION.replace('/api', '');

export const initializeWebSocket = (token: string): Socket => {
  // If socket already exists and token is the same, return it
  if (socket && currentToken === token) {
    return socket;
  }

  // If socket exists but token changed, disconnect it
  if (socket) {
    socket.disconnect();
  }

  currentToken = token;

  // Create new socket connection
  socket = io(WEBSOCKET_URL, {
    auth: {
      token,
    },
    transports: ["websocket"], // Force WebSocket transport to avoid xhr poll errors on RN
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Connection event handlers
  socket.on("connect", () => {
    console.log("🔌 [SocketService] Connected to", WEBSOCKET_URL);
  });

  socket.on("disconnect", (reason: string) => {
    console.log("🔌 [SocketService] Disconnected:", reason);
  });

  socket.on("connect_error", (error: Error) => {
    console.log("🔌 [SocketService] Connection Error:", error.message, error);
  });

  return socket;
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
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
