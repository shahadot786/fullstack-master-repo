import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@config/index";
import { UnauthorizedError } from "@common/errors";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, config.jwt.secret) as {
            id: string;
            email: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid or expired token"));
    }
};
