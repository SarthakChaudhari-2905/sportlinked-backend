import { z } from "zod";

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must contain at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9._]+$/,
      "Username can only contain letters, numbers, dots and underscores"
    )
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(120),

  phone: z
    .string()
    .trim()
    .max(20)
    .optional(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),

  role: z
    .enum([
      "ATHLETE",
      "CLUB",
      "ACADEMY",
      "AGENCY",
      "SCOUT",
    ])
    .default("ATHLETE"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export {
  registerSchema,
  loginSchema,
};