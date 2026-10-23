// ==============================================================================
// Zod Validation Schemas for Authentication & Tenant Onboarding (FORM-01)
// ==============================================================================
// Using Zod guarantees strict schema validation on the server before database calls.
// ==============================================================================

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Name must be at most 50 characters long." }),
    email: z
      .string()
      .trim()
      .email({ message: "Please provide a valid email address." })
      .toLowerCase(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password must be at most 100 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." })
    .toLowerCase(),
  password: z.string().min(1, { message: "Password is required." }),
});

export const createNewspaperSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Newspaper title must be at least 3 characters long." })
    .max(60, { message: "Newspaper title must be at most 60 characters long." }),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { message: "URL slug must be at least 3 characters long." })
    .max(40, { message: "URL slug must be at most 40 characters long." })
    .regex(/^[a-z0-9-]+$/, {
      message: "URL slug may only contain lowercase letters, numbers, and hyphens (-).",
    }),
  description: z
    .string()
    .trim()
    .max(250, { message: "Description must be at most 250 characters long." })
    .optional(),
});

export const joinNewspaperSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .min(4, { message: "Invite code must be at least 4 characters long." }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateNewspaperInput = z.infer<typeof createNewspaperSchema>;
export type JoinNewspaperInput = z.infer<typeof joinNewspaperSchema>;
