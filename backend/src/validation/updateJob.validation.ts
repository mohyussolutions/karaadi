import { z } from "zod";

export const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  salary: z.number().optional(),
  mainCategory: z.string().min(1).optional(),
  category: z.array(z.string()).optional(),
  subcategory: z.array(z.string()).optional(),
  region: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  employmentType: z.string().min(1).optional(),
  experienceLevel: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  maGaday: z.boolean().optional(),
  expiryDate: z.string().optional(),
  feeId: z.string().optional(),
  feeAmount: z.number().optional(),
  planId: z.string().optional(),
  planAmount: z.number().optional(),
});
