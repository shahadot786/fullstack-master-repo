import { create } from 'zustand';
import { StorageUtils } from '@/utils/storage';
import { STORAGE_KEYS } from '@/config/constants';
import { User } from '@/types';

/**
 * Auth Store
 * 
 * Zustand store for authentication state with MMKV persistence.
 * Manages user data, tokens, and auth status.
 */

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setUser: (user: User | null) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    updateUserAndTokens: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
    // Initial state
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    setAuth: (user, accessToken, refreshToken) => {
        // Save to storage
        StorageUtils.setObject(STORAGE_KEYS.USER, user);
        StorageUtils.setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        StorageUtils.setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        // Update state
        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            error: null,
        });
    },

    setUser: (user) => {
        if (user) {
            StorageUtils.setObject(STORAGE_KEYS.USER, user);
        } else {
            StorageUtils.remove(STORAGE_KEYS.USER);
        }
        set({ user });
    },

    setTokens: (accessToken, refreshToken) => {
        StorageUtils.setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        StorageUtils.setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        set({ accessToken, refreshToken });
    },

    updateUserAndTokens: (user, accessToken, refreshToken) => {
        // Save to storage
        StorageUtils.setObject(STORAGE_KEYS.USER, user);
        StorageUtils.setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        StorageUtils.setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

        // Update state
        set({
            user,
            accessToken,
            refreshToken,
        });
    },

    logout: () => {
        // Clear storage
        StorageUtils.remove(STORAGE_KEYS.USER);
        StorageUtils.remove(STORAGE_KEYS.ACCESS_TOKEN);
        StorageUtils.remove(STORAGE_KEYS.REFRESH_TOKEN);

        // Reset state
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
        });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    hydrate: () => {
        // Load from storage on app start
        const user = StorageUtils.getObject<User>(STORAGE_KEYS.USER);
        const accessToken = StorageUtils.getString(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = StorageUtils.getString(STORAGE_KEYS.REFRESH_TOKEN);

        if (user && accessToken && refreshToken) {
            set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
            });
        }
    },
}));
