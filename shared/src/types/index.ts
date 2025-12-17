// ============================================
// Common Types
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ============================================
// Authentication Types
// ============================================

export interface User {
    _id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: AuthTokens;
    };
}

// ============================================
// TODO Types
// ============================================

export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "pending" | "completed";

export interface Todo {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: TodoPriority;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTodoDto {
    title: string;
    description?: string;
    priority?: TodoPriority;
    dueDate?: Date;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: TodoPriority;
    dueDate?: Date;
}

export interface TodoQueryParams {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: TodoPriority;
    sortBy?: "createdAt" | "dueDate" | "priority";
    sortOrder?: "asc" | "desc";
}

// ============================================
// Error Types
// ============================================

export interface ValidationError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: ValidationError[];
    statusCode?: number;
}
