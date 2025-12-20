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
        try {
            const response = await apiClient.get(API_ENDPOINTS.STATS);
            
            if (!response.data.data) {
                return {} as ServiceStats;
            }
            
            return response.data.data;
        } catch (error: any) {
            return {} as ServiceStats;
        }
    },
};
