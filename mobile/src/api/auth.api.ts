import apiClient from "./client";
import { API_ENDPOINTS } from "@/config/constants";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  ResendOTPRequest,
  RefreshTokenRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  User,
} from "@/types";

/**
 * Authentication API
 *
 * All authentication-related API endpoints.
 */

export const authApi = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data.data;
  },

  /**
   * Verify email with OTP
   * POST /auth/verify-email
   */
  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data
    );
    // Note: verifyEmail returns user and tokens, but we're not using them here
    // The actual login happens after verification
    return response.data.data;
  },

  /**
   * Resend verification OTP
   * POST /auth/resend-verification
   */
  resendOTP: async (data: ResendOTPRequest): Promise<{ message: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      data
    );
    return response.data.data;
  },

  /**
   * Login user
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);

    // Backend returns tokens nested in 'tokens' object
    const { user, tokens } = response.data.data;
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      data
    );
    return response.data.data;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data.data;
  },

  /**
   * Get current user
   * GET /auth/me
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  /**
   * Request password reset OTP
   * POST /auth/request-password-reset
   */
  requestPasswordReset: async (
    data: RequestPasswordResetRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET,
      data
    );
    return response.data.data;
  },

  /**
   * Reset password with OTP
   * POST /auth/reset-password
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<{ message: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data.data;
  },

  /**
   * Update user profile
   * PUT /auth/profile
   */
  updateProfile: async (data: {
    name: string;
    email: string;
  }): Promise<{ user: User }> => {
    const response = await apiClient.put("/auth/profile", data);
    return response.data.data;
  },

  /**
   * Change password
   * PUT /auth/change-password
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.put("/auth/change-password", data);
    return response.data.data;
  },
};
