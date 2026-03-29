import { z } from "zod";

export const createSubscriptionSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  subCategory: z.string().optional(),
  description: z.string().optional(),
  region: z.string().min(1),
  cities: z.array(z.string()),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  totalFee: z.number().optional(),
  isPaid: z.boolean().optional(),
  paymentId: z.string().optional(),
  expiryDate: z.string().optional(),
  condition: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  specificFeatures: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.string().optional(),
  lastNotified: z.string().optional(),
  read: z.boolean().optional(),
  notificationCount: z.number().optional(),
  selectedCityIds: z.array(z.string()),
  customCities: z.array(z.string()),
  metadata: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()]),
    )
    .optional(),
});
