import apiClient from './client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendOTPRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  User,
} from '@types';

/**
 * Authentication API
 * 
 * This module contains all authentication-related API calls.
 * Each function corresponds to a backend endpoint and handles the request/response.
 * 
 * All functions are async and return Promises.
 * Errors are automatically handled by the axios interceptor.
 */

/**
 * Register a new user
 * 
 * @param data - User registration data (email, password, name)
 * @returns Promise with success message
 */
export const register = async (data: RegisterRequest): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/register', data);
  // Backend returns: { success: true, data: { message: "..." } }
  return response.data.data;
};

/**
 * Verify email with OTP
 * 
 * After registration, users receive an OTP via email.
 * This function verifies the OTP and completes the registration.
 * 
 * @param data - Email and OTP
 * @returns Promise with user data and tokens
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/verify-email', data);
  // Backend returns: { success: true, data: { user, tokens: { accessToken, refreshToken } } }
  const { user, tokens } = response.data.data;
  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * Resend verification OTP
 * 
 * If the user didn't receive the OTP or it expired,
 * they can request a new one.
 * 
 * @param data - Email address
 * @returns Promise<void>
 */
export const resendOTP = async (data: ResendOTPRequest): Promise<void> => {
  await apiClient.post('/auth/resend-verification', data);
};

/**
 * Login user
 * 
 * @param data - Email and password
 * @returns Promise with user data and tokens
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  // Backend returns: { success: true, data: { user, tokens: { accessToken, refreshToken } } }
  const { user, tokens } = response.data.data;
  return {
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * Refresh access token
 * 
 * This is called automatically by the axios interceptor when the access token expires.
 * You typically won't need to call this manually.
 * 
 * @param data - Refresh token
 * @returns Promise with new tokens
 */
export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post('/auth/refresh-token', data);
  // Backend returns: { success: true, data: { tokens: { accessToken, refreshToken } } }
  const { tokens } = response.data.data;
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * Logout user
 * 
 * Invalidates the refresh token on the server.
 * 
 * @returns Promise<void>
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

/**
 * Get current user data
 * 
 * Fetches the authenticated user's profile data.
 * 
 * @returns Promise with user data
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  // Backend returns: { success: true, data: user }
  return response.data.data;
};

/**
 * Request password reset OTP
 * 
 * Sends an OTP to the user's email for password reset.
 * 
 * @param email - User's email address
 * @returns Promise<void>
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/request-password-reset', { email });
};

/**
 * Reset password with OTP
 * 
 * Resets the user's password using the OTP received via email.
 * 
 * @param data - Email, OTP, and new password
 * @returns Promise<void>
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await apiClient.post('/auth/reset-password', data);
};
