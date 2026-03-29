import { z } from "zod";

export const globalSearchQuerySchema = z.object({
  q: z.string().min(1),
});
