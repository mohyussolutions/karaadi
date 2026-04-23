import {
  createTicketSchema,
  updateTicketSchema,
} from "src/validation/customerSupport.validation.ts";

import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  getTicketsAndMetrics,
  updateTicket,
} from "src/controllers/customerSupportController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

const customerSupportRoutes = Router();

customerSupportRoutes.get("/", ProtectRoute, getTicketsAndMetrics);

customerSupportRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createTicketSchema),
  createTicket,
);

customerSupportRoutes.put(
  "/:id",
  ProtectRoute,
  validateRequest(updateTicketSchema),
  updateTicket,
);

customerSupportRoutes.delete("/:id", ProtectRoute, deleteTicket);

export default customerSupportRoutes;
