import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV Storage Instance
 * 
 * Fast, encrypted key-value storage for React Native.
 * Used for persisting auth tokens, user data, and app state.
 */
export const storage = createMMKV({
    id: 'nexus-storage',
    encryptionKey: 'nexus-encryption-key-change-in-production',
});

/**
 * Storage Utility Functions
 * 
 * Type-safe wrappers for MMKV storage operations.
 */

export const StorageUtils = {
    /**
     * Set a string value in storage
     */
    setString: (key: string, value: string): void => {
        if (value === undefined || value === null) {
            return;
        }
        storage.set(key, value);
    },

    /**
     * Get a string value from storage
     */
    getString: (key: string): string | undefined => {
        return storage.getString(key);
    },

    /**
     * Set a boolean value in storage
     */
    setBoolean: (key: string, value: boolean): void => {
        storage.set(key, value);
    },

    /**
     * Get a boolean value from storage
     */
    getBoolean: (key: string): boolean | undefined => {
        return storage.getBoolean(key);
    },

    /**
     * Set an object in storage (JSON serialized)
     */
    setObject: (key: string, value: any): void => {
        if (value === undefined || value === null) {
            return;
        }
        storage.set(key, JSON.stringify(value));
    },

    /**
     * Get an object from storage (JSON deserialized)
     */
    getObject: <T>(key: string): T | undefined => {
        const value = storage.getString(key);
        return value ? JSON.parse(value) : undefined;
    },

    /**
     * Remove a value from storage
     */
    remove: (key: string): void => {
        storage.remove(key);
    },

    /**
     * Clear all storage
     */
    clearAll: (): void => {
        storage.clearAll();
    },

    /**
     * Check if a key exists in storage
     */
    contains: (key: string): boolean => {
        return storage.contains(key);
    },
};
