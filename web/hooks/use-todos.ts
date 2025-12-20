import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todosApi, GetTodosParams } from "@/lib/api/todos";
import { CreateTodoRequest, UpdateTodoRequest } from "@/types";

export function useGetTodos(params?: GetTodosParams) {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => todosApi.getTodos(params),
    // Keep previous data while fetching new page for smoother transitions
    placeholderData: (previousData) => previousData,
  });
}

export function useGetTodoById(id: string) {
  return useQuery({
    queryKey: ["todos", id],
    queryFn: () => todosApi.getTodoById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todosApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) =>
      todosApi.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todosApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteAllTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todosApi.deleteAllTodos(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
