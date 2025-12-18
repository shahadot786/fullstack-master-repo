import { useQuery } from '@tanstack/react-query';
import { statsApi, ServiceStats } from '@/api/stats.api';

/**
 * useStats Hook
 * 
 * Custom hook for fetching dashboard statistics with TanStack Query.
 */

const QUERY_KEYS = {
    STATS: 'stats',
};

/**
 * Fetch comprehensive stats for all services
 */
export const useStats = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.STATS],
        queryFn: () => statsApi.getStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
