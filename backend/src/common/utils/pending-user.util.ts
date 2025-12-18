import { getRedisClient } from "@common/db/redis";

export interface PendingUser {
    email: string;
    password: string; // plain text - will be hashed when creating verified user
    name: string;
    createdAt: string;
}

const PENDING_USER_PREFIX = "pending-user:";
const PENDING_USER_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

/**
 * Generate Redis key for pending user
 */
const getPendingUserKey = (email: string): string => {
    return `${PENDING_USER_PREFIX}${email.toLowerCase()}`;
};

/**
 * Store pending user data in Redis (expires in 24 hours)
 */
export const storePendingUser = async (
    email: string,
    password: string,
    name: string
): Promise<void> => {
    const redis = getRedisClient();

    // Store plain password - it will be hashed by the pre-save hook when creating the verified user
    const pendingUser: PendingUser = {
        email: email.toLowerCase(),
        password: password, // Plain password, not hashed yet
        name,
        createdAt: new Date().toISOString(),
    };

    const key = getPendingUserKey(email);
    await redis.setex(key, PENDING_USER_EXPIRY, JSON.stringify(pendingUser));
};

/**
 * Retrieve pending user data from Redis
 */
export const getPendingUser = async (
    email: string
): Promise<PendingUser | null> => {
    const redis = getRedisClient();
    const key = getPendingUserKey(email);
    const data = await redis.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data) as PendingUser;
};

/**
 * Delete pending user data from Redis
 */
export const deletePendingUser = async (email: string): Promise<void> => {
    const redis = getRedisClient();
    const key = getPendingUserKey(email);
    await redis.del(key);
};

/**
 * Check if pending user exists
 */
export const pendingUserExists = async (email: string): Promise<boolean> => {
    const redis = getRedisClient();
    const key = getPendingUserKey(email);
    const exists = await redis.exists(key);
    return exists === 1;
};

/**
 * Get remaining TTL for pending user (in seconds)
 */
export const getPendingUserTTL = async (email: string): Promise<number> => {
    const redis = getRedisClient();
    const key = getPendingUserKey(email);
    return await redis.ttl(key);
};
