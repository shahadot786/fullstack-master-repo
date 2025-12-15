import { z } from "zod";
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from "@fullstack-master/shared";

export const createTodoValidation = z.object({
    body: createTodoSchema,
});

export const updateTodoValidation = z.object({
    body: updateTodoSchema,
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid todo ID"),
    }),
});

export const getTodoValidation = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid todo ID"),
    }),
});

export const queryTodosValidation = z.object({
    query: todoQuerySchema,
});
