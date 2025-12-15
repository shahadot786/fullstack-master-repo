import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';
import type { User, LoginInput, RegisterInput, VerifyEmailInput, ResetPasswordInput, ApiResponse, AuthTokens } from '@/types';

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
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (data: ResetPasswordInput) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
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

                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

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

                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

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

                    // Update user verification status
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: { ...currentUser, isEmailVerified: true, emailVerifiedAt: new Date().toISOString() },
                            isLoading: false,
                        });
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

            requestPasswordReset: async (email: string) => {
                try {
                    set({ isLoading: true, error: null });
                    await api.post('/auth/request-password-reset', { email });
                    set({ isLoading: false });
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Failed to request password reset';
                    set({ error: message, isLoading: false });
                    throw error;
                }
            },

            resetPassword: async (data: ResetPasswordInput) => {
                try {
                    set({ isLoading: true, error: null });
                    await api.post('/auth/reset-password', data);
                    set({ isLoading: false });
                } catch (error: any) {
                    const message = error.response?.data?.message || 'Password reset failed';
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
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    });
                }
            },

            fetchUser: async () => {
                try {
                    set({ isLoading: true });
                    const response = await api.get<ApiResponse<User>>('/auth/me');
                    set({ user: response.data.data, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            setError: (error: string | null) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
