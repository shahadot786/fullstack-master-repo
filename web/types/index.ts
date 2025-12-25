export interface User {
  _id: string;
  email: string;
  name: string;
  profileImage?: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TodoPriority = "low" | "medium" | "high";
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
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
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

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: TodoPriority;
  type: TodoType;
  dueDate: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TodoPriority;
  type?: TodoType;
  dueDate?: string;
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


export interface ApiError {
  message: string;
  statusCode?: number;
}
