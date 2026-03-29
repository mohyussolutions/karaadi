import { z } from "zod";

export const updateSubscriptionStatusSchema = z.object({
  status: z.enum(["active", "inactive", "paused"]),
  isActive: z.boolean().optional(),
});
