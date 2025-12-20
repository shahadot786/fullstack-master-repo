import { Response } from "express";
import * as statsService from "./stats.service";
import { asyncHandler } from "@common/utils/async-handler.util";
import { sendSuccess } from "@common/utils/response.util";
import { AuthRequest } from "@middleware/auth.middleware";

/**
 * Get comprehensive stats for all services
 * GET /stats
 */
export const getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const stats = await statsService.getStats(userId);

    sendSuccess(res, stats, "Stats retrieved successfully");
});
