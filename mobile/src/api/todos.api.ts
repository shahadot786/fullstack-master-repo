import apiClient from './client';
import { API_ENDPOINTS } from '@/config/constants';
import {
    Todo,
    CreateTodoRequest,
    UpdateTodoRequest,
    GetTodosParams,
    TodosResponse,
} from '@/types';

/**
 * Todos API
 * 
 * All todo-related API endpoints.
 */

export const todosApi = {
    /**
     * Get all todos for authenticated user
     * GET /todos
     */
    getTodos: async (params?: GetTodosParams): Promise<TodosResponse> => {
        const response = await apiClient.get(API_ENDPOINTS.TODOS.BASE, { params });
        // Backend returns: { success: true, data: [...], pagination: {...} }
        return {
            data: response.data.data,
            pagination: response.data.pagination,
        };
    },

    /**
     * Get a single todo by ID
     * GET /todos/:id
     */
    getTodo: async (id: string): Promise<Todo> => {
        const response = await apiClient.get(API_ENDPOINTS.TODOS.BY_ID(id));
        return response.data.data;
    },

    /**
     * Create a new todo
     * POST /todos
     */
    createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
        const response = await apiClient.post(API_ENDPOINTS.TODOS.BASE, data);
        return response.data.data;
    },

    /**
     * Update a todo
     * PUT /todos/:id
     */
    updateTodo: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
        const response = await apiClient.put(API_ENDPOINTS.TODOS.BY_ID(id), data);
        return response.data.data;
    },

    /**
     * Delete a todo
     * DELETE /todos/:id
     */
    deleteTodo: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.TODOS.BY_ID(id));
    },

    /**
     * Toggle todo completion status
     * PUT /todos/:id
     */
    toggleTodo: async (id: string, completed: boolean): Promise<Todo> => {
        const response = await apiClient.put(API_ENDPOINTS.TODOS.BY_ID(id), { completed });
        return response.data.data;
    },

    /**
     * Export todos as CSV
     * GET /todos/export
     */
    exportTodos: async (params?: GetTodosParams): Promise<string> => {
        const response = await apiClient.get(`${API_ENDPOINTS.TODOS.BASE}/export`, { 
            params,
            responseType: 'text',
        });
        return response.data;
    },
};
