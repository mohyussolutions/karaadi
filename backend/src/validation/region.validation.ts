import { z } from "zod";

export const createRegionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const createCitySchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  regionId: z.string().min(1),
  isActive: z.boolean().optional(),
});
