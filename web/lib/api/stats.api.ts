import apiClient from './client';

/**
 * Stats API
 * 
 * API endpoints for fetching dashboard statistics.
 */

export interface ServiceStats {
    todos: {
        total: number;
        active: number;
        completed: number;
        highPriority: number;
        todayDue: number;
        overdue: number;
    };
    notes: {
        total: number;
        categories: number;
        recent: number;
    };
    chat: {
        totalConversations: number;
        unreadMessages: number;
    };
    ai: {
        totalQueries: number;
        tokensUsed: number;
    };
    shop: {
        totalProducts: number;
        totalOrders: number;
        revenue: number;
    };
    social: {
        totalPosts: number;
        followers: number;
        likes: number;
    };
    delivery: {
        activeDeliveries: number;
        completedDeliveries: number;
        pendingDeliveries: number;
    };
    expense: {
        totalExpenses: number;
        thisMonth: number;
        categories: number;
    };
    weather: {
        currentLocation: string;
        savedLocations: number;
    };
    urlShortener: {
        totalUrls: number;
        totalClicks: number;
        activeLinks: number;
    };
}

export const statsApi = {
    /**
     * Get comprehensive stats for all services
     * GET /stats
     */
    getStats: async (): Promise<ServiceStats> => {
        const response = await apiClient.get('/stats');
        return response.data.data;
    },
};
