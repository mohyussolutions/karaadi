import { z } from "zod";

export const createFarmequipmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  mainCategory: z.string().optional(),
  category: z.array(z.string()).optional(),
  subcategory: z.array(z.string()).optional(),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  make: z.string().optional(),
  farmequipmentModel: z.string().optional(),
  type: z.string().optional(),
  condition: z.string().optional(),
  enginePower: z.string().optional(),
  fuelType: z.string().optional(),
  year: z.number().optional(),
  hours: z.number().optional(),
  images: z.array(z.string()).optional(),
  userId: z.string().optional(),
  planId: z.string().optional(),
  planAmount: z.number().optional(),
  isPaid: z.boolean().optional(),
});

export const updateFarmequipmentSchema = createFarmequipmentSchema.partial();
