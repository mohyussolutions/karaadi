import { z } from "zod";

export const createBusinessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  orgNumber: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1),
  contactName: z.string().optional(),
  planType: z.string().optional(),
});

export const updateBusinessStatusSchema = z.object({
  status: z.enum(["pending", "active", "inactive", "suspended"]),
  isVerified: z.boolean().optional(),
});

export const extendBusinessPlanSchema = z.object({
  planId: z.string().min(1),
});

export const toggleAdminEnabledSchema = z.object({
  isAdminEnabled: z.boolean(),
});
