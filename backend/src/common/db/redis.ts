import Redis from "ioredis";
import { config } from "@config/index";

const redis = new Redis(config.redis.databaseUri);

export const connectRedis = (): void => {
    redis.on("connect", () => {
        // Redis connected
    });

    redis.on("error", (error) => {
        // Redis error - silently fail
    });

    redis.on("ready", () => {
        // Redis ready
    });
};

export const getRedisClient = (): Redis => {
    return redis;
};

export default redis;
