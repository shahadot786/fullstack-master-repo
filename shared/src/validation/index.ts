import { z } from "zod";

// ============================================
// Common Validation Schemas
// ============================================

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

// ============================================
// Authentication Validation Schemas
// ============================================

export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});

// ============================================
// TODO Validation Schemas
// ============================================

export const priorityEnum = z.enum(["low", "medium", "high"]);

export const todoTypeEnum = z.enum([
    "DSA",
    "System Design & Architecture",
    "Projects",
    "Learn",
    "Blogging",
    "Frontend",
    "Backend",
    "AI/ML",
    "DevOps",
    "Database",
    "Testing",
]);

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
    priority: priorityEnum,
    type: todoTypeEnum,
    dueDate: z.coerce.date(),
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long").optional(),
    description: z.string().max(500, "Description too long").optional(),
    completed: z.boolean().optional(),
    priority: priorityEnum.optional(),
    type: todoTypeEnum.optional(),
    dueDate: z.coerce.date().optional(),
});

export const todoQuerySchema = paginationSchema.extend({
    completed: z.coerce.boolean().optional(),
    priority: priorityEnum.optional(),
    type: todoTypeEnum.optional(),
    dueDateFrom: z.string().optional(),
    dueDateTo: z.string().optional(),
    sortBy: z.enum(["createdAt", "dueDate", "priority"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Export Types from Schemas
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
