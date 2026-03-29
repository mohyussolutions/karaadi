import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  addMessageToTicket,
  createSupportTicket,
  deleteMessage,
  deleteTicket,
  getAllTickets,
  getSupportStats,
  getTicketDetails,
  updateTicketStatus,
} from "../../controllers/userController/contanctUsController.ts";
import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createSupportTicketSchema,
  addMessageToTicketSchema,
} from "../../validation/contactUs.validation.ts";

const contactUsRouter = Router();

contactUsRouter.post(
  "/tickets",
  ProtectRoute,
  validateRequest(createSupportTicketSchema),
  createSupportTicket,
);
contactUsRouter.get("/tickets", ProtectRoute, getAllTickets);
contactUsRouter.get("/stats", ProtectRoute, getSupportStats);
contactUsRouter.get("/tickets/:ticketId", ProtectRoute, getTicketDetails);
contactUsRouter.put(
  "/tickets/:ticketId/status",
  ProtectRoute,
  updateTicketStatus,
);
contactUsRouter.post(
  "/tickets/:ticketId/messages",
  ProtectRoute,
  validateRequest(addMessageToTicketSchema),
  addMessageToTicket,
);

contactUsRouter.delete("/tickets/:ticketId", ProtectRoute, deleteTicket);
contactUsRouter.delete("/messages/:messageId", ProtectRoute, deleteMessage);

export default contactUsRouter;
