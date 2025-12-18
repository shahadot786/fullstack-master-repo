import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/api/stats.api';
import { ServiceStats } from '@/types';

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
    return useQuery<ServiceStats>({
        queryKey: [QUERY_KEYS.STATS],
        queryFn: () => statsApi.getStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
