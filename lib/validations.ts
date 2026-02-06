/**
 * Zod Validation Schemas
 * 
 * Centralized validation schemas for all forms and API inputs
 */

import { z } from "zod";

// ==========================================
// AUTH VALIDATIONS
// ==========================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ==========================================
// USER VALIDATIONS
// ==========================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable(),
});

// ==========================================
// POST VALIDATIONS
// ==========================================

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(2000, "Post must be less than 2000 characters"),
  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable(),
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(2000, "Post must be less than 2000 characters")
    .optional(),
  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .nullable(),
});

// ==========================================
// COMMENT VALIDATIONS
// ==========================================

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment must be less than 1000 characters"),
  postId: z
    .string()
    .min(1, "Post ID is required"),
});

// ==========================================
// PAGINATION VALIDATIONS
// ==========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  cursor: z.string().optional(),
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
