import { z } from "zod";

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,128}$/;

export const registerUserSchema = z.object({
  email: z.string().email().max(254),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(PASSWORD_RE, "Password must include uppercase, lowercase, number, and special character"),
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9_.-]+$/, "Username may only contain letters, numbers, underscores, dashes, and dots"),
  phone: z.string().max(20).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
});

export const updatePhoneSchema = z.object({
  phone: z.string().min(7).max(20).regex(/^\+?[\d\s\-()]+$/, "Invalid phone number"),
});

export const confirmUserSignUpSchema = z.object({
  email: z.string().email().max(254),
  code: z.string().min(1).max(20),
});

export const resendCodeSchema = z.object({
  email: z.string().email().max(254),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const resetPasswordSchema = z.object({
  email: z.string().email().max(254),
  resetCode: z.string().min(1).max(20),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .regex(PASSWORD_RE, "Password must include uppercase, lowercase, number, and special character"),
});

export const logoutSchema = z.object({});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).max(2048),
});
