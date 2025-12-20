import { Request, Response } from "express";

/**
 * Analytics Controller
 * Get all analytics for all user & services
 * GET /analytics
 */
import { asyncHandler } from "@common/utils/async-handler.util";
import { getAnalyticsStats } from "./analytics.service";

export const getAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;

    const analytics = await getAnalyticsStats(page, limit);

    res.status(200).json({
      success: true,
      message: "Analytics retrieved successfully",
      data: analytics,
    });
  }
);
