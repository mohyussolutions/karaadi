import { z } from "zod";

export const createSupportTicketSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  priority: z.string().optional(),
});

export const addMessageToTicketSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  body: z.string().min(1),
  senderRole: z.string().optional(),
});
