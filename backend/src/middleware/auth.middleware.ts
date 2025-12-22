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
        let token: string | undefined;

        // Try to get token from cookie first (for web)
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }
        // Fall back to Authorization header (for mobile)
        else {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

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
