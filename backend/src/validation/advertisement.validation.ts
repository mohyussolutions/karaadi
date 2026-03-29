import { z } from "zod";

export const createAdvertisementSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().min(1),
  link: z.string().min(1),
  buttonText: z.string().optional(),
  isActive: z.boolean().optional(),
  position: z.string().optional(),
  priority: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  clicks: z.number().optional(),
  views: z.number().optional(),
});
