import mongoose from "mongoose";
import { config } from "@config/index";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoUri);
    } catch (error) {
        throw error;
    }
};
