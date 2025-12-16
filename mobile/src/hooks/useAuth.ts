import { useAuthStore } from '@store/authStore';

/**
 * Custom Hook: useAuth
 * 
 * This hook provides a convenient interface to the auth store.
 * It's a wrapper around the Zustand store that makes it easier to use in components.
 * 
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    // State
    user: store.user,
    accessToken: store.accessToken,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions
    setUser: store.setUser,
    setTokens: store.setTokens,
    setAuth: store.setAuth,
    logout: store.logout,
    clearError: store.clearError,
    setLoading: store.setLoading,
    setError: store.setError,
  };
};
