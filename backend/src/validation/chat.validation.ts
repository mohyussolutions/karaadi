import { z } from "zod";

export const createChatSchema = z.object({
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
  itemId: z.string().min(1),
  itemModel: z.enum([
    "Marketplace",
    "Car",
    "Boat",
    "Motorcycle",
    "RealEstate",
    "Traktor",
  ]),
});

export const sendMessageSchema = z.object({
  chatId: z.string().min(1),
  senderId: z.string().min(1),
  receiverId: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
});
