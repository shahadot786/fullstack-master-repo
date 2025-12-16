import { z } from 'zod';
import { VALIDATION } from '@config/constants';

/**
 * Zod Validation Schemas
 * 
 * Zod is a TypeScript-first schema validation library that provides:
 * - Type inference (TypeScript types are automatically inferred from schemas)
 * - Runtime validation (validates data at runtime)
 * - Composable schemas (schemas can be combined and reused)
 * - Great error messages
 * 
 * These schemas are used with React Hook Form for form validation.
 */

/**
 * Email validation schema
 * Reusable email validation that can be composed into other schemas
 */
const emailSchema = z
  .string()
  .min(VALIDATION.EMAIL.MIN_LENGTH, 'Email is too short')
  .max(VALIDATION.EMAIL.MAX_LENGTH, 'Email is too long')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

/**
 * Password validation schema
 * Reusable password validation
 */
const passwordSchema = z
  .string()
  .min(VALIDATION.PASSWORD.MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`)
  .max(VALIDATION.PASSWORD.MAX_LENGTH, 'Password is too long');

/**
 * Name validation schema
 */
const nameSchema = z
  .string()
  .min(VALIDATION.NAME.MIN_LENGTH, `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`)
  .max(VALIDATION.NAME.MAX_LENGTH, `Name cannot exceed ${VALIDATION.NAME.MAX_LENGTH} characters`)
  .trim();

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Form Schema
 * Includes password confirmation validation
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Error will be shown on confirmPassword field
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Verify Email Form Schema
 */
export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

/**
 * Forgot Password Form Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Form Schema
 */
export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: z
      .string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^\d+$/, 'OTP must contain only numbers'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Todo Form Schema
 */
export const todoSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.TODO.TITLE_MIN_LENGTH, 'Title is required')
    .max(VALIDATION.TODO.TITLE_MAX_LENGTH, `Title cannot exceed ${VALIDATION.TODO.TITLE_MAX_LENGTH} characters`)
    .trim(),
  description: z
    .string()
    .max(VALIDATION.TODO.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${VALIDATION.TODO.DESCRIPTION_MAX_LENGTH} characters`)
    .optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
});

export type TodoFormData = z.infer<typeof todoSchema>;

/**
 * Resend OTP Schema
 */
export const resendOTPSchema = z.object({
  email: emailSchema,
});

export type ResendOTPFormData = z.infer<typeof resendOTPSchema>;
