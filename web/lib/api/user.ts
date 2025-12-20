import apiClient from "./client";
import { User } from "@/types";

/**
 * User API Client
 * 
 * Handles all user profile management operations
 */

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/user/profile");
    return response.data.data;
  },

  /**
   * Update user profile
   * All fields are optional. Returns tokens if name, password, or profileImage updated.
   * Returns message if email change initiated.
   */
  updateProfile: async (data: {
    name?: string;
    profileImage?: string;
    password?: string;
    currentPassword?: string;
    email?: string;
  }): Promise<
    | { user: User; tokens: { accessToken: string; refreshToken: string } }
    | { message: string }
  > => {
    const response = await apiClient.put("/user/profile", data);
    return response.data.data;
  },

  /**
   * Delete user account
   * Permanently deletes the user's account and all associated data
   */
  deleteProfile: async (): Promise<void> => {
    await apiClient.delete("/user/profile");
  },

  /**
   * Request email change
   * Sends OTP to new email address. Use authApi.verifyEmail() to complete the change.
   */
  requestEmailChange: async (newEmail: string): Promise<void> => {
    await apiClient.post("/user/request-email-change", { newEmail });
  },

  /**
   * Get all users (admin endpoint)
   */
  getAllUsers: async (params?: {
    limit?: number;
    skip?: number;
  }): Promise<{ users: User[]; total: number }> => {
    const response = await apiClient.get("/user/all", { params });
    return response.data.data;
  },
};
