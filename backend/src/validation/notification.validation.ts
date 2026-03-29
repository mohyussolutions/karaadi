import { z } from "zod";

export const notificationQuerySchema = z.object({
  userId: z.string().min(1),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1),
  itemId: z.string().optional(),
  itemType: z.string().optional(),
});
