/**
 * App Constants
 * 
 * Centralized location for all app-wide constants.
 * This makes it easy to update values and ensures consistency across the app.
 */

/**
 * API Configuration
 * These values are loaded from environment variables
 */
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * App Configuration
 */
export const APP_CONFIG = {
  NAME: process.env.APP_NAME || 'Nexus',
  VERSION: '1.0.0',
} as const;

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  // Token refresh threshold (refresh when token expires in less than this time)
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // OTP Configuration
  OTP_LENGTH: 6,
  OTP_RESEND_COOLDOWN: 60, // seconds
} as const;

/**
 * Navigation Configuration
 */
export const NAVIGATION = {
  // Drawer items
  DRAWER_ITEMS: [
    {
      id: 'todos',
      label: 'Todos',
      icon: 'checklist',
      bottomTabs: [
        { id: 'todo-list', label: 'All', icon: 'list' },
        { id: 'todo-active', label: 'Active', icon: 'circle' },
        { id: 'todo-completed', label: 'Done', icon: 'checkmark-circle' },
      ],
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'document-text',
      bottomTabs: [
        { id: 'notes-all', label: 'All Notes', icon: 'documents' },
        { id: 'notes-favorites', label: 'Favorites', icon: 'star' },
        { id: 'notes-recent', label: 'Recent', icon: 'time' },
      ],
    },
  ],
} as const;

/**
 * Theme Configuration
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  TODO: {
    TITLE_MIN_LENGTH: 1,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
} as const;

/**
 * Todo Priority Levels
 */
export const TODO_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  TODO_CREATED: 'Todo created successfully',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
} as const;
