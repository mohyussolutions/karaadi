import { z } from "zod";

const safeWebsite = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const domain = val
      .replace(/^https?:\/\/(www\.)?/i, "")
      .replace(/^www\./i, "")
      .toLowerCase()
      .replace(/[^a-z0-9.\-]/g, "")
      .trim();
    return domain ? `https://www.${domain}` : undefined;
  })
  .refine(
    (val) => !val || val.startsWith("https://www."),
    { message: "Website must use https://www." },
  );

export const createBusinessSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  orgNumber: z.string().optional(),
  address: z.string().optional(),
  website: safeWebsite,
  logo: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).min(1),
  contactName: z.string().optional(),
  planType: z.string().optional(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  orgNumber: z.string().optional(),
  address: z.string().optional(),
  website: safeWebsite,
  logo: z.string().optional(),
  description: z.string().optional(),
  contactName: z.string().optional(),
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
