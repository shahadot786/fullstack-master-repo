// ============================================
// API Constants
// ============================================

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        ME: "/api/auth/me",
        LOGOUT: "/api/auth/logout",
    },
    TODO: {
        BASE: "/api/todos",
        BY_ID: (id: string) => `/api/todos/${id}`,
    },
} as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
    AUTH: {
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_EXISTS: "Email already exists",
        UNAUTHORIZED: "Unauthorized access",
        TOKEN_EXPIRED: "Token has expired",
        TOKEN_INVALID: "Invalid token",
    },
    TODO: {
        NOT_FOUND: "Todo not found",
        TITLE_REQUIRED: "Title is required",
        TITLE_EXISTS: "Todo with this title already exists",
    },
    VALIDATION: {
        INVALID_INPUT: "Invalid input data",
        REQUIRED_FIELD: "This field is required",
    },
    SERVER: {
        INTERNAL_ERROR: "Internal server error",
        NOT_FOUND: "Resource not found",
    },
} as const;

// ============================================
// HTTP Status Codes
// ============================================

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// ============================================
// Priority Levels
// ============================================

export const PRIORITY_LEVELS = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
} as const;

export const PRIORITY_COLORS = {
    low: "#10b981", // green
    medium: "#f59e0b", // amber
    high: "#ef4444", // red
} as const;

// ============================================
// Pagination Defaults
// ============================================

export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
} as const;
