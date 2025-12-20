import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { config } from "@config/index";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middleware/error.middleware";
import authRoutes from "@services/auth/auth.routes";
import todoRoutes from "@services/todo/todo.routes";
import statsRoutes from "@services/stats/stats.routes";
import uploadRoutes from "@services/upload/upload.routes";
import userRoutes from "@services/user/user.routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ 
    origin: config.cors.origin,
    credentials: true, // Allow cookies
}));

// Cookie parser
app.use(cookieParser());

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
app.use("/api/stats", statsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);

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
