import { MMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Instance
 * 
 * MMKV is a fast, efficient, and encrypted key-value storage solution for React Native.
 * It's significantly faster than AsyncStorage and provides encryption out of the box.
 * 
 * Benefits:
 * - 30x faster than AsyncStorage
 * - Synchronous API (no async/await needed)
 * - Encrypted storage for sensitive data
 * - Type-safe with TypeScript
 * - Small bundle size
 */
export const storage = new MMKV({
  id: 'nexus-app-storage',
  // Enable encryption for secure storage of tokens and sensitive data
  encryptionKey: 'nexus-encryption-key-change-in-production',
});

/**
 * Storage Keys
 * Centralized storage keys to avoid typos and ensure consistency
 */
export const STORAGE_KEYS = {
  // Authentication
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  
  // App State
  THEME: 'theme',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ACTIVE_TAB: 'active_tab',
  
  // User Preferences
  LANGUAGE: 'language',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
} as const;

/**
 * Type-safe storage utilities
 * These functions provide a type-safe interface for storing and retrieving data
 */

/**
 * Store a string value
 */
export const setString = (key: string, value: string): void => {
  storage.set(key, value);
};

/**
 * Get a string value
 */
export const getString = (key: string): string | undefined => {
  return storage.getString(key);
};

/**
 * Store a boolean value
 */
export const setBoolean = (key: string, value: boolean): void => {
  storage.set(key, value);
};

/**
 * Get a boolean value
 */
export const getBoolean = (key: string): boolean | undefined => {
  return storage.getBoolean(key);
};

/**
 * Store a number value
 */
export const setNumber = (key: string, value: number): void => {
  storage.set(key, value);
};

/**
 * Get a number value
 */
export const getNumber = (key: string): number | undefined => {
  return storage.getNumber(key);
};

/**
 * Store an object (automatically serialized to JSON)
 */
export const setObject = <T>(key: string, value: T): void => {
  storage.set(key, JSON.stringify(value));
};

/**
 * Get an object (automatically deserialized from JSON)
 */
export const getObject = <T>(key: string): T | undefined => {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : undefined;
};

/**
 * Remove a value from storage
 */
export const remove = (key: string): void => {
  storage.delete(key);
};

/**
 * Clear all storage (use with caution!)
 */
export const clearAll = (): void => {
  storage.clearAll();
};

/**
 * Check if a key exists in storage
 */
export const contains = (key: string): boolean => {
  return storage.contains(key);
};

/**
 * Auth-specific storage utilities
 * These provide convenient methods for managing authentication data
 */

/**
 * Store authentication tokens securely
 */
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

/**
 * Get the access token
 */
export const getAccessToken = (): string | undefined => {
  return getString(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Get the refresh token
 */
export const getRefreshToken = (): string | undefined => {
  return getString(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Clear authentication data (logout)
 */
export const clearAuthData = (): void => {
  remove(STORAGE_KEYS.ACCESS_TOKEN);
  remove(STORAGE_KEYS.REFRESH_TOKEN);
  remove(STORAGE_KEYS.USER);
};

/**
 * Store user data
 */
export const setUser = <T>(user: T): void => {
  setObject(STORAGE_KEYS.USER, user);
};

/**
 * Get user data
 */
export const getUser = <T>(): T | undefined => {
  return getObject<T>(STORAGE_KEYS.USER);
};
