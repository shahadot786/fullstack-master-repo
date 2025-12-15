import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const storageKeys = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
} as const;

export const getItem = (key: string): string | undefined => {
    return storage.getString(key);
};

export const setItem = (key: string, value: string): void => {
    storage.set(key, value);
};

export const removeItem = (key: string): void => {
    storage.delete(key);
};

export const clearAll = (): void => {
    storage.clearAll();
};
