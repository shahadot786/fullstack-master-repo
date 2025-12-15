import { create } from 'zustand';
import api from '../services/api';
import type { Todo, CreateTodoInput, UpdateTodoInput, ApiResponse, PaginatedResponse } from '../types';

interface TodoState {
    todos: Todo[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    error: string | null;

    fetchTodos: () => Promise<void>;
    createTodo: (data: CreateTodoInput) => Promise<void>;
    updateTodo: (id: string, data: UpdateTodoInput) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    setPage: (page: number) => void;
    clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
    todos: [],
    total: 0,
    page: 1,
    limit: 20,
    loading: false,
    error: null,

    fetchTodos: async () => {
        try {
            set({ loading: true, error: null });
            const { page, limit } = get();

            const response = await api.get<ApiResponse<PaginatedResponse<Todo>>>('/todos', {
                params: { page, limit },
            });

            set({
                todos: response.data.data.data,
                total: response.data.data.pagination.total,
                loading: false,
            });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to fetch todos';
            set({ error: message, loading: false });
        }
    },

    createTodo: async (data: CreateTodoInput) => {
        try {
            set({ loading: true, error: null });
            const response = await api.post<ApiResponse<Todo>>('/todos', data);

            set((state) => ({
                todos: [response.data.data, ...state.todos],
                total: state.total + 1,
                loading: false,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create todo';
            set({ error: message, loading: false });
            throw error;
        }
    },

    updateTodo: async (id: string, data: UpdateTodoInput) => {
        try {
            set({ loading: true, error: null });
            const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data);

            set((state) => ({
                todos: state.todos.map((todo) =>
                    todo._id === id ? response.data.data : todo
                ),
                loading: false,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update todo';
            set({ error: message, loading: false });
            throw error;
        }
    },

    deleteTodo: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await api.delete(`/todos/${id}`);

            set((state) => ({
                todos: state.todos.filter((todo) => todo._id !== id),
                total: state.total - 1,
                loading: false,
            }));
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete todo';
            set({ error: message, loading: false });
            throw error;
        }
    },

    setPage: (page: number) => {
        set({ page });
        get().fetchTodos();
    },

    clearError: () => set({ error: null }),
}));
