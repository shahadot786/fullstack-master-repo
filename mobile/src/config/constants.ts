/**
 * Application Constants
 *
 * Centralized configuration for API endpoints, storage keys, and app settings.
 */
// API Configuration
// For Android physical devices, use your computer's local IP address
// For iOS simulator/emulator, localhost works fine
export const API_BASE_URL_PRODUCTION = process.env.API_BASE_URL_PRODUCTION || "https://nexus-backend001.onrender.com/api"

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset",
    RESET_PASSWORD: "/auth/reset-password",
    PROFILE: "/auth/profile",
    REQUEST_EMAIL_CHANGE: "/auth/request-email-change",
    VERIFY_EMAIL_CHANGE: "/auth/verify-email-change",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  // User endpoints
  USER: {
    PROFILE: "/user/profile",
    REQUEST_EMAIL_CHANGE: "/user/request-email-change",
    ALL: "/user/all",
  },
  // Todo endpoints
  TODOS: {
    BASE: "/todos",
    BY_ID: (id: string) => `/todos/${id}`,
  },
  // Chat endpoints
  CHAT: {
    CONVERSATIONS: "/chat/conversations",
    CONVERSATION_BY_ID: (id: string) => `/chat/conversations/${id}`,
    MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    MARK_READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    DELETE_MESSAGE: (id: string) => `/chat/messages/${id}`,
    UNREAD: "/chat/unread",
  },
  // Stats endpoint
  STATS: "/stats",
  // URL Shortener endpoints
  URL_BASE: "/url",
  URL_SHORTEN: "/url/shorten",
  URL_MY_URLS: "/url/my-urls",
} as const;

// Storage Keys (MMKV)
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "__nexus__production__token__access__token",
  REFRESH_TOKEN: "__nexus__production__token__refresh__token",
  USER: "user",
  ONBOARDING_COMPLETED: "onboarding_completed",
  THEME: "theme",
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.APP_NAME || "Nexus",
  OTP_LENGTH: 6,
  OTP_RESEND_COOLDOWN: 60, // seconds
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// Todo Priorities
export const TODO_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

// Theme
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
} as const;
