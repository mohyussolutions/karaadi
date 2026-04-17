export const confirmUserSignUpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1),
});

export const resendCodeSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  resetCode: z.string().min(1),
  newPassword: z.string().min(6),
});

export const logoutSchema = z.object({});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});
import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(1),
  phone: z.string().optional(),
});

export const updatePhoneSchema = z.object({
  phone: z.string().min(7),
});
