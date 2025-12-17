import { getRedisClient } from "@common/db/redis";
import { config } from "@config/index";

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in Redis with expiration
 */
export const storeOTP = async (
    key: string,
    otp: string,
    expiryMinutes: number = config.otp.expiryMinutes
): Promise<void> => {
    const redis = getRedisClient();
    const expirySeconds = expiryMinutes * 60;
    await redis.setex(key, expirySeconds, otp);
};

/**
 * Verify OTP from Redis
 */
export const verifyOTP = async (
    key: string,
    otp: string
): Promise<boolean> => {
    const redis = getRedisClient();
    const storedOTP = await redis.get(key);

    if (!storedOTP) {
        return false; // OTP expired or doesn't exist
    }

    if (storedOTP !== otp) {
        return false; // OTP doesn't match
    }

    // OTP is valid, delete it to prevent reuse
    await redis.del(key);
    return true;
};

/**
 * Delete OTP from Redis
 */
export const deleteOTP = async (key: string): Promise<void> => {
    const redis = getRedisClient();
    await redis.del(key);
};

/**
 * Check if OTP exists
 */
export const otpExists = async (key: string): Promise<boolean> => {
    const redis = getRedisClient();
    const exists = await redis.exists(key);
    return exists === 1;
};

/**
 * Get remaining TTL for OTP
 */
export const getOTPTTL = async (key: string): Promise<number> => {
    const redis = getRedisClient();
    return await redis.ttl(key);
};

/**
 * Generate OTP key for email verification
 */
export const getEmailVerificationKey = (email: string): string => {
    return `otp:email-verification:${email}`;
};

/**
 * Generate OTP key for password reset
 */
export const getPasswordResetKey = (email: string): string => {
    return `otp:password-reset:${email}`;
};

/**
 * Store refresh token in Redis
 */
export const storeRefreshToken = async (
    userId: string,
    token: string,
    expiryDays: number = 30
): Promise<void> => {
    const redis = getRedisClient();
    const key = `refresh-token:${userId}`;
    const expirySeconds = expiryDays * 24 * 60 * 60;
    await redis.setex(key, expirySeconds, token);
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = async (
    userId: string,
    token: string
): Promise<boolean> => {
    const redis = getRedisClient();
    const key = `refresh-token:${userId}`;
    const storedToken = await redis.get(key);
    return storedToken === token;
};

/**
 * Delete refresh token (logout)
 */
export const deleteRefreshToken = async (userId: string): Promise<void> => {
    const redis = getRedisClient();
    const key = `refresh-token:${userId}`;
    await redis.del(key);
};

/**
 * Cache data in Redis
 */
export const cacheData = async (
    key: string,
    data: any,
    expirySeconds: number = 3600
): Promise<void> => {
    const redis = getRedisClient();
    await redis.setex(key, expirySeconds, JSON.stringify(data));
};

/**
 * Get cached data from Redis
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

/**
 * Delete cached data
 */
export const deleteCachedData = async (key: string): Promise<void> => {
    const redis = getRedisClient();
    await redis.del(key);
};
