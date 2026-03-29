import { z } from "zod";

export const globalFilteringQuerySchema = z.object({
  q: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});
