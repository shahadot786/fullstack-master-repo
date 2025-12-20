import dotenv from "dotenv";
dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    mongoUri: string;
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
    };
    redis: {
        databaseUri: string;
    };
    email: {
        resendApiKey: string;
        from: string;
    };
    otp: {
        expiryMinutes: number;
    };
}

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

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
        expiresIn: process.env.JWT_EXPIRES_IN || "10m",
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    },
    redis: {
        databaseUri: process.env.REDIS_DATABASE_URI || "redis://localhost:6379",
    },
    email: {
        resendApiKey: process.env.RESEND_API_KEY || "",
        from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    },
    otp: {
        expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || "10", 10),
    },
};
