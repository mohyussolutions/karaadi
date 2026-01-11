import {
  addMessageToTicket,
  createSupportTicket,
  deleteMessage,
  deleteTicket,
  getAllTickets,
  getSupportStats,
  getTicketDetails,
  updateTicketStatus,
} from "controllers/userController/contanctUsController.ts";
import { Router } from "express";

const router = Router();

router.post("/tickets", createSupportTicket);
router.get("/tickets", getAllTickets);
router.get("/stats", getSupportStats);
router.get("/tickets/:ticketId", getTicketDetails);
router.put("/tickets/:ticketId/status", updateTicketStatus);
router.post("/tickets/:ticketId/messages", addMessageToTicket);

router.delete("/tickets/:ticketId", deleteTicket);
router.delete("/messages/:messageId", deleteMessage);

export default router;
