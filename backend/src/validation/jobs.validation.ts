import { z } from "zod";
import * as s from "../core/utils/sanitize.ts";

export const createJobSchema = z.object({
  title: s.title,
  description: s.description,
  salary: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional().default(0),
  mainCategory: s.shortStr("Category").optional().default("Jobs"),
  category: z.array(s.shortStr()).max(5).optional().default(["Jobs"]),
  subcategory: z.array(s.shortStr()).max(5).optional().default([]),
  region: s.shortStr("Region"),
  city: s.shortStr("City"),
  company: s.optShortStr(),
  location: z.string().max(300).optional(),
  employmentType: s.shortStr("Employment type"),
  experienceLevel: s.optShortStr(),
  images: s.images.optional().default([]),
  maGaday: z.boolean().optional(),
  expiryDate: z.string().max(30).optional(),
  feeId: z.string().max(128).optional(),
  feeAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  planId: z.string().max(128).optional(),
  planAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  isPaid: z.boolean().optional(),
});
