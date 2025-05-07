import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(1, { message: "Name is Required" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20),
});

export const TaskValidation = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.string(),
  status: z.string(),
  assignedTo: z.string().optional(),
});

export const StatusValidation = z.object({
  status: z.string(),
});
