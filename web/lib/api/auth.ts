import apiClient from "./client";
import {
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendOTPRequest,
  User,
} from "@/types";

export const authApi = {
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/register", data);
    return response.data.data; // Extract from {success, data: {message}}
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<{ user: User }> => {
    const response = await apiClient.post("/auth/verify-email", data);
    // Backend returns: {success, data: {user, tokens: {accessToken, refreshToken}}}
    // Tokens are set as cookies, we only need the user
    const { user } = response.data.data;
    return { user };
  },

  resendOTP: async (data: ResendOTPRequest): Promise<void> => {
    await apiClient.post("/auth/resend-verification", data);
  },

  login: async (data: LoginRequest): Promise<{ user: User }> => {
    const response = await apiClient.post("/auth/login", data);
    // Backend returns: {success, data: {user, tokens: {accessToken, refreshToken}}}
    // Tokens are set as cookies, we only need the user
    const { user } = response.data.data;
    return { user };
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

  updateProfile: async (data: {
    name?: string;
  }): Promise<{ user: User }> => {
    const response = await apiClient.put("/auth/profile", data);
    // Extract user, tokens are set as cookies
    const { user } = response.data.data;
    return { user };
  },

  updateProfileImage: async (profileImageUrl: string): Promise<{ user: User }> => {
    const response = await apiClient.put("/auth/profile-image", { profileImageUrl });
    const { user } = response.data.data;
    return { user };
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await apiClient.put("/auth/change-password", data);
    // Tokens are updated as cookies by backend
  },

  requestEmailChange: async (data: { newEmail: string }): Promise<{ message: string }> => {
    const response = await apiClient.post("/auth/request-email-change", data);
    return response.data.data;
  },

  verifyEmailChange: async (data: { newEmail: string; otp: string }): Promise<{ user: User }> => {
    const response = await apiClient.post("/auth/verify-email-change", data);
    const { user } = response.data.data;
    return { user };
  },

  refreshToken: async (): Promise<void> => {
    // Backend reads refreshToken from cookie and sets new tokens as cookies
    await apiClient.post("/auth/refresh-token", {});
  },
};
