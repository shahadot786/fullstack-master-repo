import { create } from 'zustand';
import api from '../services/api';
import { getItem, setItem, removeItem, storageKeys } from '../utils/storage';
import type { User, LoginInput, RegisterInput, VerifyEmailInput, ApiResponse, AuthTokens } from '../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<{ needsVerification: boolean }>;
    verifyEmail: (data: VerifyEmailInput) => Promise<void>;
    resendVerificationOTP: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (data: LoginInput) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', data);

            const { user, tokens } = response.data.data;

            setItem(storageKeys.ACCESS_TOKEN, tokens.accessToken);
            setItem(storageKeys.REFRESH_TOKEN, tokens.refreshToken);
            setItem(storageKeys.USER, JSON.stringify(user));

            set({
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    register: async (data: RegisterInput) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', data);

            const { user, tokens } = response.data.data;

            setItem(storageKeys.ACCESS_TOKEN, tokens.accessToken);
            setItem(storageKeys.REFRESH_TOKEN, tokens.refreshToken);
            setItem(storageKeys.USER, JSON.stringify(user));

            set({
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            });

            return { needsVerification: !user.isEmailVerified };
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (data: VerifyEmailInput) => {
        try {
            set({ isLoading: true, error: null });
            await api.post('/auth/verify-email', data);

            const currentUser = get().user;
            if (currentUser) {
                const updatedUser = { ...currentUser, isEmailVerified: true };
                setItem(storageKeys.USER, JSON.stringify(updatedUser));
                set({ user: updatedUser, isLoading: false });
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Verification failed';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    resendVerificationOTP: async (email: string) => {
        try {
            set({ isLoading: true, error: null });
            await api.post('/auth/resend-verification', { email });
            set({ isLoading: false });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to resend OTP';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            removeItem(storageKeys.ACCESS_TOKEN);
            removeItem(storageKeys.REFRESH_TOKEN);
            removeItem(storageKeys.USER);
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            });
        }
    },

    loadUser: () => {
        const userStr = getItem(storageKeys.USER);
        const accessToken = getItem(storageKeys.ACCESS_TOKEN);
        const refreshToken = getItem(storageKeys.REFRESH_TOKEN);

        if (userStr && accessToken && refreshToken) {
            try {
                const user = JSON.parse(userStr);
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            } catch (error) {
                console.error('Failed to load user:', error);
            }
        }
    },

    setError: (error: string | null) => set({ error }),
}));
