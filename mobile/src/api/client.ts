import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  STORAGE_KEYS,
  APP_CONFIG,
} from "@/config/constants";
import { StorageUtils } from "@/utils/storage";
import { ApiError } from "@/types";

/**
 * API Client
 *
 * Centralized axios instance with request/response interceptors for:
 * - Auto-adding auth tokens
 * - Auto-refreshing expired tokens
 * - Consistent error handling
 */

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor
 * Automatically adds Authorization header with access token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = StorageUtils.getString(STORAGE_KEYS.ACCESS_TOKEN);

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 errors and auto-refreshes tokens
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent refresh on auth endpoints (except refresh-token)
      const isAuthEndpoint = originalRequest.url?.includes("/auth/");
      const isRefreshEndpoint = originalRequest.url?.includes(
        "/auth/refresh-token"
      );

      if (isAuthEndpoint && !isRefreshEndpoint) {
        return Promise.reject(formatError(error));
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = StorageUtils.getString(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token, logout user
        handleLogout();
        return Promise.reject(formatError(error));
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Save new tokens
        StorageUtils.setString(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        StorageUtils.setString(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process queued requests
        processQueue();
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(formatError(refreshError as AxiosError));
      }
    }

    return Promise.reject(formatError(error));
  }
);

/**
 * Format error to consistent structure
 */
const formatError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as any;
    return {
      message: data?.message || "An error occurred",
      statusCode: error.response.status,
      errors: data?.errors,
    };
  } else if (error.request) {
    console.log(JSON.stringify(error, null, 4));
    // Request made but no response
    return {
      message: "Network error. Please check your connection.",
      statusCode: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || "An unexpected error occurred",
    };
  }
};

/**
 * Handle logout (clear storage)
 */
const handleLogout = () => {
  StorageUtils.remove(STORAGE_KEYS.ACCESS_TOKEN);
  StorageUtils.remove(STORAGE_KEYS.REFRESH_TOKEN);
  StorageUtils.remove(STORAGE_KEYS.USER);

  // Note: Navigation to login screen will be handled by the app's auth state
};

export default apiClient;
