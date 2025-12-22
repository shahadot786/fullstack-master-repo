import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "@config/index";
import jwt from "jsonwebtoken";

let io: Server;

export const initializeWebSocket = (server: HTTPServer): Server => {
    io = new Server(server, {
        cors: {
            origin: config.cors.origin,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Authentication middleware for WebSocket
    io.use((socket, next) => {
        // Support both cookie-based (web) and token-based (mobile) authentication
        // For web: token comes from cookies
        // For mobile: token comes from socket.handshake.auth.token
        const cookieHeader = socket.handshake.headers.cookie;
        let token: string | undefined;

        // Try to get token from cookie first (for web)
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split('=');
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);
            token = cookies.accessToken;
        }

        // Fall back to auth token (for mobile)
        if (!token) {
            token = socket.handshake.auth.token;
        }

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as {
                id: string;
                email: string;
            };
            socket.data.user = decoded;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.user.id;

        // Join user-specific room
        socket.join(`user:${userId}`);

        // Handle disconnection
        socket.on("disconnect", () => {
            // User disconnected
        });

        // Example: Handle custom events
        socket.on("ping", () => {
            socket.emit("pong", { timestamp: new Date().toISOString() });
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("WebSocket not initialized. Call initializeWebSocket() first.");
    }
    return io;
};

// Helper functions to emit events to specific users
export const emitToUser = (userId: string, event: string, data: any): void => {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
};

export const emitToAll = (event: string, data: any): void => {
    const io = getIO();
    io.emit(event, data);
};

// Example: Emit notification when email is verified
export const notifyEmailVerified = (userId: string): void => {
    emitToUser(userId, "email:verified", {
        message: "Your email has been verified successfully",
        timestamp: new Date().toISOString(),
    });
};

// Example: Emit notification when password is reset
export const notifyPasswordReset = (userId: string): void => {
    emitToUser(userId, "password:reset", {
        message: "Your password has been reset successfully",
        timestamp: new Date().toISOString(),
    });
};
