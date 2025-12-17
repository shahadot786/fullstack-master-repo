/**
 * Application Constants
 * 
 * Centralized configuration for API endpoints, storage keys, and app settings.
 */

// API Configuration
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: '/auth/register',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
        LOGIN: '/auth/login',
        REFRESH_TOKEN: '/auth/refresh-token',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
        RESET_PASSWORD: '/auth/reset-password',
    },
    // Todo endpoints
    TODOS: {
        BASE: '/todos',
        BY_ID: (id: string) => `/todos/${id}`,
    },
} as const;

// Storage Keys (MMKV)
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    THEME: 'theme',
} as const;

// App Configuration
export const APP_CONFIG = {
    NAME: process.env.APP_NAME || 'Nexus',
    OTP_LENGTH: 6,
    OTP_RESEND_COOLDOWN: 60, // seconds
    REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// Todo Priorities
export const TODO_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
} as const;

// Theme
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
} as const;
