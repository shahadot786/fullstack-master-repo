import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit, { ipKeyGenerator } from "express-rate-limit"; // rate limiter
import swaggerUi from "swagger-ui-express";
import { config } from "@config/index";
import { swaggerSpec } from "@config/swagger";
import { errorHandler } from "@middleware/error.middleware";
import authRoutes from "@services/auth/auth.routes";
import todoRoutes from "@services/todo/todo.routes";
import statsRoutes from "@services/stats/stats.routes";
import uploadRoutes from "@services/upload/upload.routes";
import userRoutes from "@services/user/user.routes";
import analyticsRoutes from "@services/analytics/analytics.routes";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true, // Allow cookies
  })
);

// Cookie parser
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter config
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user?.id ? 100 : 20), // higher quota if authenticated
  message: { error: "Too many requests, please try again later!" },
  standardHeaders: true, // include RateLimit-* headers
  legacyHeaders: true, // include X-RateLimit-* headers
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown", 56), // group by IP/subnet
});
app.use(limiter); // apply globally

// API Documentation
app.use(
  "/api-docs",
  ...(swaggerUi.serve as any),
  swaggerUi.setup(swaggerSpec) as any
);

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
app.use("/api/analytics", analyticsRoutes);

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
