import apiClient from "./client";
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodosResponse, TodoType } from "@/types";

export interface GetTodosParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  type?: TodoType;
  dueDate?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export const todosApi = {
  getTodos: async (params?: GetTodosParams): Promise<TodosResponse> => {
    const response = await apiClient.get("/todos", { params });
    // Backend returns: {success, data: [...todos], pagination: {...}}
    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getTodoById: async (id: string): Promise<Todo> => {
    const response = await apiClient.get(`/todos/${id}`);
    // Backend returns: {success, data: todo}
    return response.data.data;
  },

  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await apiClient.post("/todos", data);
    // Backend returns: {success, data: todo}
    return response.data.data;
  },

  updateTodo: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await apiClient.put(`/todos/${id}`, data);
    // Backend returns: {success, data: todo}
    return response.data.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },

  deleteAllTodos: async (): Promise<void> => {
    await apiClient.delete("/todos");
  },

  exportTodos: async (params?: GetTodosParams): Promise<Blob> => {
    const response = await apiClient.get("/todos/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
