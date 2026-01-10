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
            
            if (!response.data || !response.data.data) {
                throw new Error("Invalid stats data received from server");
            }
            
            return response.data.data;
        } catch (error: any) {
            console.error("Stats API Error:", error);
            throw error;
        }
    },
};
