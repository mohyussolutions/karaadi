import { z } from "zod";

export const getChatMessagesSchema = z.object({
  chatId: z.string().min(1),
  userId: z.string().min(1),
});

export const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  receiverId: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
});
