import { z } from "zod";
import * as s from "../core/utils/sanitize.ts";

const commonFields = {
  userId: z.string().min(1).max(128).optional(),
  title: s.title.optional(),
  description: s.description.optional(),
  price: z.coerce.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  mainCategory: s.optShortStr(),
  category: z.array(s.shortStr()).max(5).optional(),
  subcategory: z.array(s.shortStr()).max(5).optional(),
  region: s.optShortStr(),
  city: s.optShortStr(),
  images: s.images.optional(),
  isPaid: z.boolean().optional(),
  planId: z.string().max(128).optional(),
  planAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  feeId: z.string().max(128).optional(),
  feeAmount: z.number().min(0).max(s.LIMITS.PRICE_MAX).optional(),
  bedrooms: z.number().int().min(0).max(100).optional(),
  bathrooms: z.number().int().min(0).max(100).optional(),
  floor: z.number().int().min(-10).max(300).optional(),
  totalFloors: z.number().int().min(0).max(300).optional(),
  sizeSqm: z.union([z.number().min(0).max(1_000_000), z.string().max(20)]).optional(),
  area: z.number().min(0).max(1_000_000).optional(),
  propertyType: s.optShortStr(),
  furnished: z.boolean().optional(),
  parking: z.boolean().optional(),
  hasGarage: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  amenities: z.array(z.string().max(100)).max(20).optional(),
  address: z.string().max(500).transform(s.strip).optional(),
  yearBuilt: z.number().int().min(1800).max(2100).optional(),
};

export const updateRealEstateSchema = z.object(commonFields);

export const createRealEstateSchema = z.object({
  ...commonFields,
  userId: z.string().min(1).max(128),
  title: s.title,
  description: s.description,
  price: z.coerce.number().min(0).max(s.LIMITS.PRICE_MAX),
  region: s.shortStr("Region"),
  city: s.shortStr("City"),
  images: s.images,
  category: z.array(s.shortStr()).max(5),
  subcategory: z.array(s.shortStr()).max(5),
});
