/**
 * TypeScript Type Definitions
 * 
 * Interfaces and types matching backend models and API contracts.
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
    _id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
    emailVerifiedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export interface ResendOTPRequest {
    email: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RequestPasswordResetRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    newPassword: string;
}

// ============================================================================
// Todo Types
// ============================================================================

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: TodoPriority;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTodoRequest {
    title: string;
    description?: string;
    priority?: TodoPriority;
    dueDate?: string;
}

export interface UpdateTodoRequest {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: TodoPriority;
    dueDate?: string;
}

export interface GetTodosParams {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: TodoPriority;
}

export interface TodosResponse {
    data: Todo[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: ApiError;
}

// ============================================================================
// App State Types
// ============================================================================

export type Theme = 'light' | 'dark';

export interface AppState {
    onboardingCompleted: boolean;
    theme: Theme;
}

// ============================================================================
// Navigation Types (Expo Router)
// ============================================================================

export type RootStackParamList = {
    index: undefined;
    onboarding: undefined;
    '(auth)/login': undefined;
    '(auth)/register': undefined;
    '(auth)/verify-email': { email?: string };
    '(auth)/forgot-password': undefined;
    '(auth)/reset-password': { email?: string };
    '(main)/(todos)': undefined;
    '(main)/(todos)/create': undefined;
    '(main)/(todos)/edit/[id]': { id: string };
    '(main)/notes': undefined;
    '(main)/settings': undefined;
};

// ============================================================================
// Stats Types
// ============================================================================

export interface ServiceStats {
    todos: {
        total: number;
        active: number;
        completed: number;
        highPriority: number;
        todayDue: number;
        overdue: number;
    };
    notes: {
        total: number;
        categories: number;
        recent: number;
    };
    chat: {
        totalConversations: number;
        unreadMessages: number;
    };
    ai: {
        totalQueries: number;
        tokensUsed: number;
    };
    shop: {
        totalProducts: number;
        totalOrders: number;
        revenue: number;
    };
    social: {
        totalPosts: number;
        followers: number;
        likes: number;
    };
    delivery: {
        activeDeliveries: number;
        completedDeliveries: number;
        pendingDeliveries: number;
    };
    expense: {
        totalExpenses: number;
        thisMonth: number;
        categories: number;
    };
    weather: {
        currentLocation: string;
        savedLocations: number;
    };
    urlShortener: {
        totalUrls: number;
        totalClicks: number;
        activeLinks: number;
    };
}
