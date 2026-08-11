import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
