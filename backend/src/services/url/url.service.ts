const { nanoid } = require("nanoid");
import Url, { IUrl } from "./url.model";
import { NotFoundError, BadRequestError } from "@common/errors";
import mongoose from "mongoose";

/**
 * Shorten a URL
 */
export const shortenUrl = async (
    userId: string,
    originalUrl: string,
    title?: string
): Promise<IUrl> => {
    // Validate and normalize URL
    let normalizedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate using URL constructor and basic hostname check
    try {
        const parsedUrl = new URL(normalizedUrl);
        // Ensure it has a valid TLD-like structure (e.g., must have a dot)
        if (!parsedUrl.hostname.includes(".")) {
             throw new Error("Invalid hostname");
        }
        originalUrl = normalizedUrl;
    } catch (e) {
        throw new BadRequestError("Invalid URL format. Please enter a valid URL (e.g., google.com or https://google.com)");
    }

    // Generate shortId
    const shortId = nanoid(8);

    const url = await Url.create({
        userId: new mongoose.Types.ObjectId(userId),
        originalUrl,
        shortId,
        title,
    });

    return url;
};

/**
 * Get all URLs for a user
 */
export const getUserUrls = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
): Promise<{ urls: IUrl[]; total: number }> => {
    const skip = (page - 1) * limit;
    const sort: any = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [urls, total] = await Promise.all([
        Url.find({ userId: new mongoose.Types.ObjectId(userId) })
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Url.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    return { urls, total };
};

/**
 * Get original URL and increment clicks
 */
export const getOriginalUrl = async (shortId: string): Promise<string> => {
    const url = await Url.findOne({ shortId, isActive: true });

    if (!url) {
        throw new NotFoundError("Short URL not found");
    }

    // Increment clicks asynchronously
    url.clicks += 1;
    url.lastClickedAt = new Date();
    await url.save();

    return url.originalUrl;
};

/**
 * Delete a URL
 */
export const deleteUrl = async (userId: string, urlId: string): Promise<void> => {
    const result = await Url.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(urlId),
        userId: new mongoose.Types.ObjectId(userId),
    });

    if (!result) {
        throw new NotFoundError("URL not found or unauthorized");
    }
};

/**
 * Get stats for a URL
 */
export const getUrlStats = async (userId: string, urlId: string): Promise<IUrl> => {
    const url = await Url.findOne({
        _id: new mongoose.Types.ObjectId(urlId),
        userId: new mongoose.Types.ObjectId(userId),
    });

    if (!url) {
        throw new NotFoundError("URL not found or unauthorized");
    }

    return url;
};
