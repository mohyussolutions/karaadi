import { z } from "zod";

export const createJobSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  salary: z.number(),
  mainCategory: z.string().min(1),
  category: z.array(z.string()),
  subcategory: z.array(z.string()),
  region: z.string().min(1),
  city: z.string().min(1),
  employmentType: z.string().min(1),
  experienceLevel: z.string().min(1),
  images: z.array(z.string()),
  maGaday: z.boolean().optional(),
  expiryDate: z.string().optional(),
  feeId: z.string().optional(),
  feeAmount: z.number().optional(),
  planId: z.string().optional(),
  planAmount: z.number().optional(),
});
