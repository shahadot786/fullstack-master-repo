import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/api/stats.api';
import { ServiceStats } from '@/types';
import { useAuthStore } from '@/store/authStore';

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
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return useQuery<ServiceStats>({
        queryKey: [QUERY_KEYS.STATS],
        queryFn: async () => {
            try {
                const result = await statsApi.getStats();
                return result;
            } catch (error: any) {
               return error;
            }
        },
        enabled: isAuthenticated, // Only fetch when user is authenticated
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnMount: 'always', // Always refetch on mount to get fresh data
        refetchOnWindowFocus: false,
    });
};
