import { getRedisClient } from "@common/db/redis";
import bcrypt from "bcryptjs";

export interface PendingUser {
    email: string;
    password: string; // hashed
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
    
    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const pendingUser: PendingUser = {
        email: email.toLowerCase(),
        password: hashedPassword,
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
