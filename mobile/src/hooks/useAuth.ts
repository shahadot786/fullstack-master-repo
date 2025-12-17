import { useAuthStore } from '@/store/authStore';

/**
 * useAuth Hook
 * 
 * Custom hook for accessing auth store.
 * Provides convenient access to auth state and actions.
 */

export const useAuth = () => {
    const {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        error,
        setAuth,
        setUser,
        setTokens,
        logout,
        setLoading,
        setError,
        clearError,
    } = useAuthStore();

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        error,
        setAuth,
        setUser,
        setTokens,
        logout,
        setLoading,
        setError,
        clearError,
    };
};
