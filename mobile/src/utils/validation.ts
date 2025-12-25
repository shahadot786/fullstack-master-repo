import { z } from 'zod';

/**
 * Validation Schemas
 * 
 * Zod schemas for form validation using React Hook Form.
 */

// ============================================================================
// Auth Validation Schemas
// ============================================================================

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .trim(),
    email: z
        .string()
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
    otp: z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
});

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
    otp: z
        .string()
        .length(6, 'OTP must be 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters'),
});

// ============================================================================
// Todo Validation Schemas
// ============================================================================

export const createTodoSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    priority: z
        .enum(['low', 'medium', 'high']),
    type: z
        .enum([
            'DSA',
            'System Design & Architecture',
            'Projects',
            'Learn',
            'Blogging',
            'Frontend',
            'Backend',
            'AI/ML',
            'DevOps',
            'Database',
            'Testing',
        ]),
    dueDate: z
        .string()
        .datetime(),
});

export const updateTodoSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim()
        .optional(),
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .trim()
        .optional(),
    completed: z
        .boolean()
        .optional(),
    priority: z
        .enum(['low', 'medium', 'high'])
        .optional(),
    type: z
        .enum([
            'DSA',
            'System Design & Architecture',
            'Projects',
            'Learn',
            'Blogging',
            'Frontend',
            'Backend',
            'AI/ML',
            'DevOps',
            'Database',
            'Testing',
        ])
        .optional(),
    dueDate: z
        .string()
        .datetime()
        .optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
