import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import app from "./app";
import { connectDB } from "@common/db/mongo";
import { connectRedis } from "@common/db/redis";
import { initializeEmailService } from "@common/services/email.service";
import { initializeWebSocket } from "@common/services/websocket.service";
import { config } from "@config/index";

const PORT = config.port;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    connectRedis();

    // Initialize email service
    initializeEmailService();

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize WebSocket
    initializeWebSocket(httpServer);

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🔌 WebSocket server ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
