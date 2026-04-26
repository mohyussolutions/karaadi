import { z } from "zod";
import * as s from "../core/utils/sanitize.ts";

export const createMarketplaceItemSchema = z.object({
  userId: z.string().min(1).max(128),
  title: s.title,
  description: s.description,
  price: s.price(),
  mainCategory: s.shortStr("Category"),
  category: z.array(s.shortStr()).max(5),
  subcategory: z.array(s.shortStr()).max(5),
  region: s.shortStr("Region"),
  city: s.shortStr("City"),
  images: s.images,
  condition: s.optShortStr(),
  isPaid: z.boolean().optional(),
  planId: z.string().max(128).optional(),
  planAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  feeId: z.string().max(128).optional(),
  feeAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
});

export const marketplaceQuerySchema = z.object({
  type: z.string().max(100).optional(),
  listingType: z.string().max(50).optional(),
  region: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
});
