import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '@/api/todos.api';
import { useTodoStore } from '@/store/todoStore';
import {
    CreateTodoRequest,
    UpdateTodoRequest,
    GetTodosParams,
} from '@/types';

/**
 * useTodos Hook
 * 
 * Custom hook for todo operations with TanStack Query.
 * Provides data fetching, caching, and mutations.
 */

const QUERY_KEYS = {
    TODOS: 'todos',
    TODO: (id: string) => ['todo', id],
};

/**
 * Fetch todos with optional filtering
 */
export const useTodos = (params?: GetTodosParams) => {
    const setTodos = useTodoStore((state) => state.setTodos);
    const setLoading = useTodoStore((state) => state.setLoading);
    const setError = useTodoStore((state) => state.setError);

    return useQuery({
        queryKey: [QUERY_KEYS.TODOS, params],
        queryFn: async () => {
            setLoading(true);
            try {
                const response = await todosApi.getTodos(params);
                setTodos(response.todos);
                setError(null);
                return response;
            } catch (error: any) {
                setError(error.message || 'Failed to fetch todos');
                throw error;
            } finally {
                setLoading(false);
            }
        },
    });
};

/**
 * Fetch single todo by ID
 */
export const useTodo = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.TODO(id),
        queryFn: () => todosApi.getTodo(id),
        enabled: !!id,
    });
};

/**
 * Create todo mutation
 */
export const useCreateTodo = () => {
    const queryClient = useQueryClient();
    const addTodo = useTodoStore((state) => state.addTodo);

    return useMutation({
        mutationFn: (data: CreateTodoRequest) => todosApi.createTodo(data),
        onSuccess: (newTodo) => {
            addTodo(newTodo);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
        },
    });
};

/**
 * Update todo mutation
 */
export const useUpdateTodo = () => {
    const queryClient = useQueryClient();
    const updateTodo = useTodoStore((state) => state.updateTodo);

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
            todosApi.updateTodo(id, data),
        onSuccess: (updatedTodo) => {
            updateTodo(updatedTodo._id, updatedTodo);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TODO(updatedTodo._id) });
        },
    });
};

/**
 * Delete todo mutation
 */
export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    const deleteTodo = useTodoStore((state) => state.deleteTodo);

    return useMutation({
        mutationFn: (id: string) => todosApi.deleteTodo(id),
        onSuccess: (_, id) => {
            deleteTodo(id);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
        },
    });
};

/**
 * Toggle todo completion mutation
 */
export const useToggleTodo = () => {
    const queryClient = useQueryClient();
    const updateTodo = useTodoStore((state) => state.updateTodo);

    return useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            todosApi.toggleTodo(id, completed),
        onSuccess: (updatedTodo) => {
            updateTodo(updatedTodo._id, updatedTodo);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TODOS] });
        },
    });
};
