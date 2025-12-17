import apiClient from "./client";
import {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendOTPRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from "@/types";

export const authApi = {
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data.data; // Extract from {success, data: {message}}
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/verify-email", data);
    // Backend returns: {success, data: {user, tokens: {accessToken, refreshToken}}}
    const { user, tokens } = response.data.data;
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  resendOTP: async (data: ResendOTPRequest): Promise<void> => {
    await apiClient.post("/auth/resend-verification", data);
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", data);
    // Backend returns: {success, data: {user, tokens: {accessToken, refreshToken}}}
    const { user, tokens } = response.data.data;
    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post("/auth/refresh-token", data);
    // Backend returns: {success, data: {tokens: {accessToken, refreshToken}}}
    const { tokens } = response.data.data;
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get("/auth/me");
    return response.data.data; // Extract from {success, data: user}
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post("/auth/request-password-reset", { email });
  },

  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post("/auth/reset-password", { email, otp, newPassword });
  },

  updateProfile: async (data: { name: string; email: string }): Promise<{ user: User }> => {
    const response = await apiClient.put("/auth/profile", data);
    return response.data.data; // Extract from {success, data: {user}}
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put("/auth/change-password", data);
  },
};
