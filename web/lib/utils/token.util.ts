/**
 * JWT Token Utility
 * Client-side utilities for checking token expiration
 * Note: This does NOT verify the token signature (server-side only)
 */

interface JWTPayload {
  id: string;
  email: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token without verification
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired or will expire soon
 * @param token - JWT token string
 * @param thresholdMinutes - Minutes before expiration to consider "near expired" (default: 8)
 * @returns true if token needs refresh, false otherwise
 */
export const shouldRefreshToken = (
  token: string,
  thresholdMinutes: number = 8
): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const expiresAt = decoded.exp;
  const thresholdSeconds = thresholdMinutes * 60;

  // Check if token expires within threshold
  return expiresAt - now <= thresholdSeconds;
};

/**
 * Get access token from cookie (client-side)
 * @returns Access token string or null
 */
export const getAccessTokenFromCookie = (): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'accessToken') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * Check if access token needs refresh
 * @returns true if refresh is needed, false otherwise
 */
export const needsTokenRefresh = (): boolean => {
  const token = getAccessTokenFromCookie();
  if (!token) {
    return false;
  }
  return shouldRefreshToken(token);
};
