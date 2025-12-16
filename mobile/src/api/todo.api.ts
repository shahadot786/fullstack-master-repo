import apiClient from './client';
import { Todo, CreateTodoRequest, UpdateTodoRequest, GetTodosParams } from '@types';

/**
 * Todo API
 * 
 * This module contains all todo-related API calls.
 * Each function corresponds to a backend endpoint.
 * 
 * These functions are used by React Query hooks for data fetching,
 * caching, and synchronization.
 */

/**
 * Get all todos for the authenticated user
 * 
 * Supports filtering and pagination via query parameters.
 * 
 * @param params - Optional query parameters (page, limit, completed, priority)
 * @returns Promise with array of todos
 */
export const getTodos = async (params?: GetTodosParams): Promise<Todo[]> => {
  const response = await apiClient.get('/todos', { params });
  // Backend returns: { success: true, data: [...todos], pagination: {...} }
  return response.data.data;
};

/**
 * Get a single todo by ID
 * 
 * @param id - Todo ID
 * @returns Promise with todo data
 */
export const getTodoById = async (id: string): Promise<Todo> => {
  const response = await apiClient.get(`/todos/${id}`);
  // Backend returns: { success: true, data: todo }
  return response.data.data;
};

/**
 * Create a new todo
 * 
 * @param data - Todo data (title, description, priority, dueDate)
 * @returns Promise with created todo
 */
export const createTodo = async (data: CreateTodoRequest): Promise<Todo> => {
  const response = await apiClient.post('/todos', data);
  // Backend returns: { success: true, data: todo }
  return response.data.data;
};

/**
 * Update an existing todo
 * 
 * @param id - Todo ID
 * @param data - Updated todo data
 * @returns Promise with updated todo
 */
export const updateTodo = async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
  const response = await apiClient.put(`/todos/${id}`, data);
  // Backend returns: { success: true, data: todo }
  return response.data.data;
};

/**
 * Delete a todo
 * 
 * @param id - Todo ID
 * @returns Promise<void>
 */
export const deleteTodo = async (id: string): Promise<void> => {
  await apiClient.delete(`/todos/${id}`);
};

/**
 * Delete all todos for the authenticated user
 * 
 * Use with caution!
 * 
 * @returns Promise<void>
 */
export const deleteAllTodos = async (): Promise<void> => {
  await apiClient.delete('/todos');
};
