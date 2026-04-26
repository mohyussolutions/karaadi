import { z } from "zod";
import * as s from "../core/utils/sanitize.ts";

export const createSubscriptionSchema = z.object({
  userId: z.string().min(1).max(128),
  title: z.string().min(1).max(200).transform(s.strip),
  category: z.string().min(1).max(100),
  subCategory: z.string().max(100).optional(),
  description: z.string().max(1000).transform(s.strip).optional(),
  region: z.string().min(1).max(100),
  cities: z.array(z.string().max(100)).max(20),
  priceMin: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  priceMax: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  totalFee: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  isPaid: z.boolean().optional(),
  paymentId: z.string().max(128).optional(),
  expiryDate: z.string().max(30).optional(),
  condition: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  specificFeatures: z.string().max(500).transform(s.strip).optional(),
  isActive: z.boolean().optional(),
  status: z.string().max(50).optional(),
  lastNotified: z.string().max(30).optional(),
  read: z.boolean().optional(),
  notificationCount: z.number().int().min(0).max(100_000).optional(),
  selectedCityIds: z.array(z.string().max(128)).max(20),
  customCities: z.array(z.string().max(100)).max(20),
  metadata: z
    .record(z.string().max(100), z.union([z.string().max(500), z.number(), z.boolean(), z.null()]))
    .optional(),
});
