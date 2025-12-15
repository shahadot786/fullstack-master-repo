import Redis from "ioredis";
import { config } from "@config/index";

let redisClient: Redis;

export const connectRedis = (): Redis => {
    if (redisClient) {
        return redisClient;
    }

    const options: any = {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        maxRetriesPerRequest: 3,
    };

    // Add TLS configuration if enabled
    if (config.redis.tls) {
        options.tls = {
            rejectUnauthorized: false, // Set to true in production with proper certificates
        };
    }

    redisClient = new Redis(options);

    redisClient.on("connect", () => {
        console.log("✅ Redis connected successfully");
    });

    redisClient.on("error", (error) => {
        console.error("❌ Redis connection error:", error);
    });

    redisClient.on("ready", () => {
        console.log("✅ Redis is ready to accept commands");
    });

    return redisClient;
};

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call connectRedis() first.");
    }
    return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        console.log("Redis disconnected");
    }
};
