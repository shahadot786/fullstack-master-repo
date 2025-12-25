import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { needsTokenRefresh } from "@/lib/utils/token.util";


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true, // Send cookies with requests
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
 * Proactively refresh token if it's about to expire
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token check for auth endpoints
    if (config.url?.includes("/auth/")) {
      return config;
    }

    // Check if token needs refresh (expires within 8 minutes)
    if (needsTokenRefresh()) {
      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        return config;
      }

      // Start refresh process
      isRefreshing = true;
      try {
        await apiClient.post("/auth/refresh-token", {});
        processQueue();
      } catch (error) {
        processQueue(error);
        // If refresh fails, let the request proceed and handle via response interceptor
      } finally {
        isRefreshing = false;
      }
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
        return Promise.reject(error);
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

      try {
        // Attempt to refresh token
        // Backend will read refreshToken from cookie and set new tokens as cookies
        await apiClient.post("/auth/refresh-token", {});

        // Process queued requests
        processQueue();
        isRefreshing = false;

        // Retry original request with new access token (set as cookie)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear queue and redirect to login
        processQueue(refreshError);
        isRefreshing = false;

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
