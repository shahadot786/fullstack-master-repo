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
   * 
   * Handles both registration verification and email change verification
   */
  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data
    );
    // Backend returns: {success, data: {user, tokens: {accessToken, refreshToken}}}
    const { user, tokens } = response.data.data;
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
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
   * Update user profile (name only)
   * PUT /auth/profile
   */
  updateProfile: async (data: {
    name?: string;
  }): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data);
    const { user, tokens } = response.data.data;
    return { user, tokens };
  },

  /**
   * Update user profile image
   * PUT /auth/profile-image
   */
  updateProfileImage: async (
    profileImageUrl: string
  ): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await apiClient.put("/auth/profile-image", { profileImageUrl });
    const { user, tokens } = response.data.data;
    return { user, tokens };
  },

  /**
   * Request email change (sends OTP to new email)
   * POST /auth/request-email-change
   */
  requestEmailChange: async (data: {
    newEmail: string;
  }): Promise<{ message: string }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REQUEST_EMAIL_CHANGE, data);
    return response.data.data;
  },

  /**
   * Verify email change with OTP
   * POST /auth/verify-email-change
   */
  verifyEmailChange: async (data: {
    newEmail: string;
    otp: string;
  }): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_CHANGE, data);
    const { user, tokens } = response.data.data;
    return { user, tokens };
  },

  /**
   * Change password
   * PUT /auth/change-password
   * 
   * Returns new tokens after password change (security best practice)
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ tokens: { accessToken: string; refreshToken: string } }> => {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    const { tokens } = response.data.data;
    return { tokens };
  },
};
