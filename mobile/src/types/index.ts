/**
 * TypeScript Type Definitions
 * 
 * This file contains all the type definitions used throughout the app.
 * Keeping types centralized makes it easier to maintain and ensures consistency.
 */

/**
 * User Types
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication Types
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
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

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

/**
 * Todo Types
 */
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

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Error Types
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Navigation Types
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email: string };
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

export type MainDrawerParamList = {
  Todos: undefined;
  Notes: undefined;
  Settings: undefined;
};

export type TodoStackParamList = {
  TodoList: undefined;
  TodoDetail: { todoId: string };
  CreateTodo: undefined;
  EditTodo: { todoId: string };
};

export type TodoTabParamList = {
  AllTodos: undefined;
  ActiveTodos: undefined;
  CompletedTodos: undefined;
};

export type NotesTabParamList = {
  AllNotes: undefined;
  FavoriteNotes: undefined;
  RecentNotes: undefined;
};

/**
 * Theme Types
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Store Types
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export interface AppState {
  onboardingCompleted: boolean;
  activeDrawerItem: string;
  
  // Actions
  completeOnboarding: () => void;
  setActiveDrawerItem: (item: string) => void;
}
