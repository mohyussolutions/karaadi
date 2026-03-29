import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../../validation/customerSupport.validation.ts";
import {
  createTicket,
  deleteTicket,
  getTicketsAndMetrics,
  updateTicket,
} from "../../controllers/userController/customerSupportController.ts";
import { Router } from "express";

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
