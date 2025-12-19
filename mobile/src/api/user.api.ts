import apiClient from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import { User } from "@/types";

/**
 * User API
 * 
 * All user profile management endpoints
 */

export const userApi = {
  /**
   * Get current user profile
   * GET /user/profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    return response.data.data;
  },

  /**
   * Update user profile
   * PUT /user/profile
   * 
   * All fields are optional:
   * - name: Updates display name, returns new tokens
   * - profileImage: Updates profile image, returns new tokens
   * - password: Updates password (requires currentPassword), returns new tokens
   * - email: Initiates email change flow, sends OTP, returns message (no tokens)
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
    const response = await apiClient.put(API_ENDPOINTS.USER.PROFILE, data);
    return response.data.data;
  },

  /**
   * Delete user account
   * DELETE /user/profile
   * 
   * Permanently deletes the user's account and all associated data
   */
  deleteProfile: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER.PROFILE);
  },

  /**
   * Request email change
   * POST /user/request-email-change
   * 
   * Sends OTP to new email address.
   * Use authApi.verifyEmail() with the new email and OTP to complete the change.
   */
  requestEmailChange: async (newEmail: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USER.REQUEST_EMAIL_CHANGE, { newEmail });
  },

  /**
   * Get all users (admin endpoint)
   * GET /user/all
   */
  getAllUsers: async (params?: {
    limit?: number;
    skip?: number;
  }): Promise<{ users: User[]; total: number }> => {
    const response = await apiClient.get(API_ENDPOINTS.USER.ALL, { params });
    return response.data.data;
  },
};
