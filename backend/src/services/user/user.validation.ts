import { z } from 'zod';

/**
 * User Validation Schemas
 */

export const updateProfileValidation = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    currentPassword: z.string().optional(),
    profileImage: z.string().url('Invalid image URL').optional(),
});

export const getAllUsersValidation = z.object({
    limit: z.string().optional(),
    skip: z.string().optional(),
});
