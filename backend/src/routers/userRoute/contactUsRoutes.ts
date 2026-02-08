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

const contactUsRouter = Router();

contactUsRouter.post("/tickets", createSupportTicket);
contactUsRouter.get("/tickets", getAllTickets);
contactUsRouter.get("/stats", getSupportStats);
contactUsRouter.get("/tickets/:ticketId", getTicketDetails);
contactUsRouter.put("/tickets/:ticketId/status", updateTicketStatus);
contactUsRouter.post("/tickets/:ticketId/messages", addMessageToTicket);

contactUsRouter.delete("/tickets/:ticketId", deleteTicket);
contactUsRouter.delete("/messages/:messageId", deleteMessage);

export default contactUsRouter;
