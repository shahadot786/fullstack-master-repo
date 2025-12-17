import { Request, Response, NextFunction } from "express";
import { AppError } from "@common/errors";
import { config } from "@config/index";
import { HTTP_STATUS } from "@fullstack-master/shared";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(config.nodeEnv === "development" && { stack: err.stack }),
        });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Validation failed",
            errors: err.message,
        });
    }

    // Handle Mongoose duplicate key errors
    if (err.name === "MongoServerError" && (err as any).code === 11000) {
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            message: "Duplicate field value entered",
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Invalid token",
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            message: "Token expired",
        });
    }

    // Default error
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        ...(config.nodeEnv === "development" && { stack: err.stack }),
    });
};
