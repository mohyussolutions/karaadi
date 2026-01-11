import {
  createTicket,
  deleteTicket,
  getTicketsAndMetrics,
  updateTicket,
} from "controllers/userController/customerSupportController.ts";
import { Router } from "express";

const customerSupportRoutes = Router();

customerSupportRoutes.get("/", (req, res, next) => {
  getTicketsAndMetrics(req, res).catch(next);
});

customerSupportRoutes.post("/", (req, res, next) => {
  createTicket(req, res).catch(next);
});

customerSupportRoutes.put("/:id", (req, res, next) => {
  updateTicket(req, res).catch(next);
});

customerSupportRoutes.delete("/:id", (req, res, next) => {
  deleteTicket(req, res).catch(next);
});

export default customerSupportRoutes;
