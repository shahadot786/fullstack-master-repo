import { Response } from "express";
import { AuthRequest } from "@middleware/auth.middleware";
import * as urlService from "./url.service";

/**
 * Create a shortened URL
 */
export const shortenUrl = async (req: AuthRequest, res: Response) => {
    const { originalUrl, title } = req.body;
    const userId = req.user!.id;

    const url = await urlService.shortenUrl(userId, originalUrl, title);

    res.status(201).json({
        success: true,
        message: "URL shortened successfully",
        data: url,
    });
};

/**
 * Get all URLs for current user
 */
export const getMyUrls = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

    const { urls, total } = await urlService.getUserUrls(
        userId,
        page,
        limit,
        sortBy,
        sortOrder
    );

    res.status(200).json({
        success: true,
        data: urls,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};

/**
 * Redirect from short URL
 */
export const redirectUrl = async (req: AuthRequest, res: Response) => {
    const { shortId } = req.params;

    const originalUrl = await urlService.getOriginalUrl(shortId);

    // If it's an API request, return the URL, else redirect
    if (req.headers.accept?.includes("application/json")) {
        return res.status(200).json({
            success: true,
            data: { originalUrl },
        });
    }

    res.redirect(originalUrl);
};

/**
 * Delete a shortened URL
 */
export const deleteUrl = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await urlService.deleteUrl(userId, id);

    res.status(200).json({
        success: true,
        message: "URL deleted successfully",
    });
};

/**
 * Get URL stats
 */
export const getUrlStats = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const url = await urlService.getUrlStats(userId, id);

    res.status(200).json({
        success: true,
        data: url,
    });
};
