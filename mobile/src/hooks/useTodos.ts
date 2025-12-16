import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as todoApi from '@api/todo.api';
import { Todo, CreateTodoRequest, UpdateTodoRequest, GetTodosParams } from '@types';

/**
 * Custom Hooks for Todo Operations using Tanstack Query
 * 
 * Tanstack Query (formerly React Query) provides:
 * - Automatic caching
 * - Background refetching
 * - Optimistic updates
 * - Request deduplication
 * - Loading and error states
 * 
 * These hooks make it easy to fetch, create, update, and delete todos
 * while handling all the complex state management automatically.
 */

/**
 * Query Keys
 * Centralized query keys for cache management
 */
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params?: GetTodosParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

/**
 * Hook: Get all todos
 * 
 * @param params - Optional query parameters
 * @returns Query result with todos data
 */
export const useGetTodos = (params?: GetTodosParams) => {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoApi.getTodos(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

/**
 * Hook: Get a single todo by ID
 * 
 * @param id - Todo ID
 * @returns Query result with todo data
 */
export const useGetTodoById = (id: string) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoApi.getTodoById(id),
    enabled: !!id, // Only run query if ID is provided
  });
};

/**
 * Hook: Create a new todo
 * 
 * @returns Mutation function and state
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoApi.createTodo(data),
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook: Update a todo
 * 
 * @returns Mutation function and state
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      todoApi.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo._id), updatedTodo);
      
      // Invalidate todos list to refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook: Delete a todo
 * 
 * @returns Mutation function and state
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: (_, deletedId) => {
      // Remove the todo from cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
      
      // Invalidate todos list to refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook: Delete all todos
 * 
 * @returns Mutation function and state
 */
export const useDeleteAllTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todoApi.deleteAllTodos(),
    onSuccess: () => {
      // Invalidate all todo queries
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
};

/**
 * Hook: Toggle todo completion status
 * 
 * This is a convenience hook that combines the update mutation
 * with optimistic updates for a better user experience.
 * 
 * @returns Mutation function and state
 */
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todoApi.updateTodo(id, { completed }),
    
    // Optimistic update: Update UI immediately before API call completes
    onMutate: async ({ id, completed }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });

      // Snapshot previous value
      const previousTodo = queryClient.getQueryData<Todo>(todoKeys.detail(id));

      // Optimistically update the cache
      if (previousTodo) {
        queryClient.setQueryData<Todo>(todoKeys.detail(id), {
          ...previousTodo,
          completed,
        });
      }

      // Return context with previous value
      return { previousTodo };
    },
    
    // If mutation fails, rollback to previous value
    onError: (err, { id }, context) => {
      if (context?.previousTodo) {
        queryClient.setQueryData(todoKeys.detail(id), context.previousTodo);
      }
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};
