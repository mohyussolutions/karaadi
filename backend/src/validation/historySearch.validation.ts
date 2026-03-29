import { z } from "zod";

export const createSearchLogSchema = z.object({
  query: z.string().min(1),
  category: z.string().optional(),
  userId: z.string().optional(),
});

export const deleteSearchLogSchema = z.object({
  q: z.string().min(1),
});
