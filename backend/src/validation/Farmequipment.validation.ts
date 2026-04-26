import { z } from "zod";
import * as s from "../core/utils/sanitize.ts";

export const createFarmequipmentSchema = z.object({
  userId: z.string().max(128).optional(),
  title: s.title,
  description: s.description,
  price: z.coerce.number().min(0).max(s.LIMITS.PRICE_MAX),
  mainCategory: s.optShortStr(),
  category: z.array(s.shortStr()).max(5).optional(),
  subcategory: z.array(s.shortStr()).max(5).optional(),
  region: s.shortStr("Region"),
  city: s.shortStr("City"),
  name: s.optShortStr(),
  brand: s.optShortStr(),
  make: s.optShortStr(),
  farmequipmentModel: s.optShortStr(),
  equipmentType: s.optShortStr(),
  type: s.optShortStr(),
  condition: s.optShortStr(),
  enginePower: s.optShortStr(),
  fuelType: s.optShortStr(),
  year: z.union([z.number().int().min(1900).max(2100), z.string().max(10)]).optional(),
  hours: z.union([z.number().min(0).max(1_000_000), z.string().max(20)]).optional(),
  hoursUsed: z.union([z.number().min(0).max(1_000_000), z.string().max(20)]).optional(),
  attachmentsIncluded: z.union([z.boolean(), z.string().max(10)]).optional(),
  images: s.images.optional(),
  isPaid: z.boolean().optional(),
  planId: z.string().max(128).optional(),
  planAmount: z.coerce.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  feeId: z.string().max(128).optional(),
  feeAmount: z.coerce.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
});

export const updateFarmequipmentSchema = createFarmequipmentSchema.partial();
