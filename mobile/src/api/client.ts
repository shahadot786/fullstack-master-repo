import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@config/constants';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthData } from '@utils/storage';
import { ApiError } from '@types';

/**
 * Axios API Client
 * 
 * This is the central HTTP client for all API requests.
 * It includes interceptors for:
 * - Adding authentication tokens to requests
 * - Automatically refreshing expired tokens
 * - Handling errors consistently
 * 
 * Benefits of using interceptors:
 * - Centralized auth logic (no need to add tokens manually in every request)
 * - Automatic token refresh (seamless user experience)
 * - Consistent error handling across the app
 */

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * This interceptor runs before every request is sent.
 * It automatically adds the access token to the Authorization header.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get the access token from storage
    const token = getAccessToken();
    
    // If token exists, add it to the Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * This interceptor runs after every response is received.
 * It handles token refresh when the access token expires (401 error).
 * 
 * Token Refresh Flow:
 * 1. API request fails with 401 (Unauthorized)
 * 2. Interceptor catches the error
 * 3. Attempts to refresh the access token using the refresh token
 * 4. If refresh succeeds, retry the original request with new token
 * 5. If refresh fails, logout the user
 */
apiClient.interceptors.response.use(
  // Pass through successful responses
  (response) => response,
  
  // Handle error responses
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        // Get the refresh token from storage
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token available, clear auth data and reject
          clearAuthData();
          return Promise.reject(error);
        }

        // Attempt to refresh the access token
        // Note: We use axios.post directly (not apiClient) to avoid triggering the interceptor
        const response = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        // Extract new tokens from response
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

        // Store the new tokens
        setAuthTokens(accessToken, newRefreshToken);

        // Update the Authorization header with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, clear auth data and logout
        clearAuthData();
        
        // You can dispatch a logout action here if needed
        // For now, we just reject the error
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, reject with a formatted error
    return Promise.reject(formatError(error));
  }
);

/**
 * Format API errors into a consistent structure
 * 
 * This function converts axios errors into our ApiError type
 * for consistent error handling throughout the app.
 */
const formatError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with an error status
    const data = error.response.data as any;
    return {
      message: data?.message || 'An error occurred',
      statusCode: error.response.status,
      errors: data?.errors,
    };
  } else if (error.request) {
    // Request was made but no response received (network error)
    return {
      message: 'Network error. Please check your internet connection.',
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }
};

export default apiClient;
