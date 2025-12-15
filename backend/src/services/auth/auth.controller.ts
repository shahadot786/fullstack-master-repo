import { Response } from "express";
import * as authService from "./auth.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";
import { HTTP_STATUS } from "@fullstack-master/shared";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password, name } = req.body;

    const { user, token } = await authService.register(email, password, name);

    sendSuccess(
        res,
        {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            tokens: {
                accessToken: token,
            },
        },
        "User registered successfully",
        HTTP_STATUS.CREATED
    );
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    sendSuccess(res, {
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        tokens: {
            accessToken: token,
        },
    }, "Login successful");
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getUserById(req.user!.id);

    sendSuccess(res, {
        _id: user!._id,
        email: user!.email,
        name: user!.name,
        createdAt: user!.createdAt,
        updatedAt: user!.updatedAt,
    });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    // In a stateless JWT setup, logout is handled client-side
    // Here we just send a success response
    sendSuccess(res, null, "Logout successful");
});
