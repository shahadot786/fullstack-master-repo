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
    profileImage?: string;
    isEmailVerified: boolean;
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
export type TodoType = 
    | "DSA" 
    | "System Design & Architecture" 
    | "Projects" 
    | "Learn" 
    | "Blogging" 
    | "Frontend" 
    | "Backend" 
    | "AI/ML" 
    | "DevOps" 
    | "Database" 
    | "Testing";

export interface Todo {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: TodoPriority;
    type: TodoType;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTodoDto {
    title: string;
    description?: string;
    priority: TodoPriority;
    type: TodoType;
    dueDate: Date;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: TodoPriority;
    type?: TodoType;
    dueDate?: Date;
}

export interface TodoQueryParams {
    page?: number;
    limit?: number;
    completed?: boolean;
    priority?: TodoPriority;
    type?: TodoType;
    dueDate?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    sortBy?: "createdAt" | "dueDate" | "priority";
    sortOrder?: "asc" | "desc";
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

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsService {
    name: string;
    total: number;
    completed: number;
    pending: number;
}

export interface AnalyticsUser {
    id: string;
    name: string;
    imageUrl: string;
    createdAt: Date;
    services: AnalyticsService[];
}

export interface AnalyticsStats {
    users: AnalyticsUser[];
    services: AnalyticsService[];
}

export interface AnalyticsResponse {
    success: boolean;
    message: string;
    data: AnalyticsStats & {
        pagination: PaginationMeta;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
