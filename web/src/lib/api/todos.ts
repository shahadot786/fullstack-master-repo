import api from './client';

// Todo types
export interface Todo {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface GetTodosParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface TodosResponse {
  success: boolean;
  data: Todo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Fetch all todos with pagination and filters
 */
export async function getTodos(params?: GetTodosParams): Promise<TodosResponse> {
  const response = await api.get('/todos', { params });
  return response.data;
}

/**
 * Get a single todo by ID
 */
export async function getTodoById(id: string): Promise<{ success: boolean; data: Todo }> {
  const response = await api.get(`/todos/${id}`);
  return response.data;
}

/**
 * Create a new todo
 */
export async function createTodo(data: CreateTodoData): Promise<{ success: boolean; data: Todo }> {
  const response = await api.post('/todos', data);
  return response.data;
}

/**
 * Update an existing todo
 */
export async function updateTodo(id: string, data: UpdateTodoData): Promise<{ success: boolean; data: Todo }> {
  const response = await api.put(`/todos/${id}`, data);
  return response.data;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: string): Promise<{ success: boolean }> {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
}

/**
 * Delete all todos
 */
export async function deleteAllTodos(): Promise<{ success: boolean; data: { deletedCount: number } }> {
  const response = await api.delete('/todos');
  return response.data;
}
