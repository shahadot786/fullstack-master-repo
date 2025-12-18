import { HTTP_STATUS } from "@fullstack-master/shared";

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = "Validation failed") {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized access") {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = "Resource already exists") {
        super(message, HTTP_STATUS.CONFLICT);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Access forbidden") {
        super(message, HTTP_STATUS.FORBIDDEN);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = "Internal server error") {
        super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string = "Bad request") {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}
