import { z } from "zod";

export const createMarketplaceItemSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
  mainCategory: z.string().min(1),
  category: z.array(z.string()),
  subcategory: z.array(z.string()),
  region: z.string().min(1),
  city: z.string().min(1),
  images: z.array(z.string()),
  isPaid: z.boolean().optional(),
  planId: z.string().optional(),
  planAmount: z.number().optional(),
  feeId: z.string().optional(),
  feeAmount: z.number().optional(),
});

export const marketplaceQuerySchema = z.object({
  type: z.string().optional(),
  listingType: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  subcategory: z.string().optional(),
  category: z.string().optional(),
});
