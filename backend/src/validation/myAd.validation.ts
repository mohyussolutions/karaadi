import { z } from "zod";

export const updateAdSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().optional(),
  maGaday: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  status: z.string().optional(),
});
