import  apiClient  from "./client";
import { AnalyticsResponse } from "@repo/shared";

/**
 * Analytics API Client
 * Handles all analytics-related API calls
 */

/**
 * Get global analytics for all users and services
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 6)
 * @returns Promise with analytics data
 */
export const getAnalytics = async (page: number = 1, limit: number = 6): Promise<AnalyticsResponse> => {
  const response = await apiClient.get<AnalyticsResponse>(`/analytics?page=${page}&limit=${limit}`);
  return response.data;
};
