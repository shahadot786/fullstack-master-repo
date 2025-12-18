import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import { ServiceStats } from '@/types';

/**
 * Stats API
 * 
 * API endpoints for fetching dashboard statistics.
 */

export const statsApi = {
    /**
     * Get comprehensive stats for all services
     * GET /stats
     */
    getStats: async (): Promise<ServiceStats> => {
        const response = await apiClient.get(API_ENDPOINTS.STATS);
        return response.data.data;
    },
};
