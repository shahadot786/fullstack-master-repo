import { create } from 'zustand';
import { AuthState, User } from '@types';
import { setUser as saveUser, setAuthTokens, clearAuthData, getUser, getAccessToken, getRefreshToken } from '@utils/storage';

/**
 * Auth Store (Zustand)
 * 
 * Zustand is a small, fast, and scalable state management solution.
 * It's simpler than Redux and doesn't require providers or context.
 * 
 * Benefits:
 * - No boilerplate code
 * - No providers needed
 * - TypeScript support out of the box
 * - Easy to use hooks
 * - Automatic re-renders when state changes
 * 
 * This store manages authentication state including:
 * - User data
 * - Access and refresh tokens
 * - Loading and error states
 * 
 * The store is automatically persisted to MMKV storage.
 */

/**
 * Create the auth store
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: getUser<User>() || null,
  accessToken: getAccessToken() || null,
  refreshToken: getRefreshToken() || null,
  isAuthenticated: !!getAccessToken(),
  isLoading: false,
  error: null,

  /**
   * Set user data
   * 
   * @param user - User object
   */
  setUser: (user: User) => {
    saveUser(user);
    set({ user, isAuthenticated: true });
  },

  /**
   * Set authentication tokens
   * 
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    setAuthTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  /**
   * Set complete auth state (user + tokens)
   * 
   * This is typically called after successful login or registration.
   * 
   * @param user - User object
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   */
  setAuth: (user: User, accessToken: string, refreshToken: string) => {
    saveUser(user);
    setAuthTokens(accessToken, refreshToken);
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      error: null,
    });
  },

  /**
   * Logout user
   * 
   * Clears all auth data from state and storage.
   */
  logout: () => {
    clearAuthData();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Set loading state
   * 
   * @param loading - Loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * Set error state
   * 
   * @param error - Error message
   */
  setError: (error: string) => {
    set({ error, isLoading: false });
  },
}));
