import { z } from "zod";

export const createTicketSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const updateTicketSchema = z.object({
  adminReply: z.string().optional(),
  status: z.string().optional(),
});
