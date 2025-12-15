import jwt from "jsonwebtoken";
import User, { IUser } from "./auth.model";
import { config } from "@config/index";
import { ConflictError, UnauthorizedError } from "@common/errors";
import { ERROR_MESSAGES } from "@fullstack-master/shared";

export const register = async (
    email: string,
    password: string,
    name: string
): Promise<{ user: IUser; token: string }> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError(ERROR_MESSAGES.AUTH.EMAIL_EXISTS);
    }

    // Create new user
    const user = await User.create({
        email,
        password,
        name,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return { user, token };
};

export const login = async (
    email: string,
    password: string
): Promise<{ user: IUser; token: string }> => {
    // Find user with password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new UnauthorizedError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Remove password from response
    user.password = undefined as any;

    return { user, token };
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId);
};

// Helper function to generate JWT token
const generateToken = (id: string, email: string): string => {
    return jwt.sign({ id, email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};
