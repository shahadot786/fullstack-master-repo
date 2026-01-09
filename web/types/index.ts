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

// ============================================
// Chat Types
// ============================================

export type MessageType = "text" | "image" | "file";
export type ConversationType = "direct" | "group";

export interface ChatUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface ReadReceipt {
  userId: string;
  readAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: ChatUser | string;
  content: string;
  messageType: MessageType;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: ReadReceipt[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LastMessage {
  content: string;
  senderId: string;
  messageType: MessageType;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: ChatUser[];
  type: ConversationType;
  name?: string;
  image?: string;
  lastMessage?: LastMessage;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  participantIds: string[];
  type?: ConversationType;
  name?: string;
}

export interface SendMessageDto {
  content?: string;
  messageType?: MessageType;
  imageUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ConversationsResponse {
  success: boolean;
  data: Conversation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
  pagination: {
    total: number;
    hasMore: boolean;
  };
}

export interface ChatQueryParams {
  page?: number;
  limit?: number;
  before?: string;
}


// ============================================
// Weather Types
// ============================================

export interface WeatherForecast {
  dt: number;
  temp: number;
  description: string;
  icon: string;
  condition: string;
}

export interface WeatherData {
  city: string;
  country: string;
  description: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  condition: string;
  sunrise: number;
  sunset: number;
  dt: number;
  forecast?: WeatherForecast[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============================================
// URL Shortener Types
// ============================================

export interface Url {
  _id: string;
  userId: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  title?: string;
  lastClickedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUrlDto {
  originalUrl: string;
  title?: string;
}

export interface UrlQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "clicks";
  sortOrder?: "asc" | "desc";
}

export interface UrlsResponse {
  data: Url[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// Expense Tracker Types
// ============================================

export type DefaultExpenseCategory = 
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Entertainment"
  | "Health"
  | "Education"
  | "Other";

export type PaymentMethod = "Cash" | "Card" | "bKash" | "Nagad" | "Upay" | "Rocket" | "Bank Transfer";

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  amount: number;
  category: string;
  description?: string;
  date?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateExpenseDto {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
  paymentMethod?: PaymentMethod;
}

export interface ExpenseQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "amount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface ExpenseStats {
  total: number;
  count: number;
  byCategory: { category: string; total: number; count: number }[];
  byPaymentMethod: { method: string; total: number; count: number }[];
}

export interface ExpensesResponse {
  data: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ExpenseCategory {
  _id: string;
  name: string;
  userId: string | null;
  icon?: string;
  emoji?: string;
  color?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
