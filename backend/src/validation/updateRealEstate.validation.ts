import { z } from "zod";

export const updateRealEstateSchema = z.object({
  userId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().optional(),
  mainCategory: z.string().min(1).optional(),
  category: z.array(z.string()).optional(),
  subcategory: z.array(z.string()).optional(),
  region: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  isPaid: z.boolean().optional(),
  planId: z.string().optional(),
  planAmount: z.number().optional(),
  feeId: z.string().optional(),
  feeAmount: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.number().optional(),
  propertyType: z.string().optional(),
  furnished: z.boolean().optional(),
  yearBuilt: z.number().optional(),
});

export const createRealEstateSchema = z
  .object({
    userId: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.coerce.number(),
    mainCategory: z.string().min(1),
    category: z.array(z.string()),
    subcategory: z.array(z.string()),
    region: z.string().min(1),
    city: z.string().min(1),
    images: z.array(z.string()),
  })
  .passthrough();
