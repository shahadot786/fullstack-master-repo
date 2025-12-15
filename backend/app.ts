import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { config } from "@config/index";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middleware/error.middleware";
import authRoutes from "@services/auth/auth.routes";
import todoRoutes from "@services/todo/todo.routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use("/api-docs", ...swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
