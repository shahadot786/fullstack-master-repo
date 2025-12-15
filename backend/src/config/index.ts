import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    mongoUri: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    cors: {
        origin: string;
    };
}

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

export const config: Config = {
    port: parseInt(process.env.PORT || "8000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUri: process.env.MONGO_URI!,
    jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    },
};
