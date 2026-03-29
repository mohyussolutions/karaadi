import { z } from "zod";
export const createReportSchema = z.object({
  userId: z.string().min(1),
  itemId: z.string().min(1),
  itemType: z.string().min(1),
  reason: z.string().min(1),
  description: z.string().optional(),
});
export const updateReportStatusSchema = z.object({
  status: z.string().min(1),
});
