import Redis from "ioredis";
import { config } from "@config/index";

const redis = new Redis(config.redis.databaseUri);

export const connectRedis = (): void => {
    redis.on("connect", () => {
        console.log("✅ Redis connected successfully");
    });

    redis.on("error", (error) => {
        console.error("❌ Redis connection error:", error);
    });

    redis.on("ready", () => {
        console.log("🔄 Redis is ready to accept commands");
    });
};

export default redis;
