import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createTicket,
  deleteTicket,
  getTicketsAndMetrics,
  updateTicket,
} from "../../controllers/userController/customerSupportController.ts";
import { Router } from "express";

const customerSupportRoutes = Router();

customerSupportRoutes.get("/", ProtectRoute, (req, res, next) => {
  getTicketsAndMetrics(req, res).catch(next);
});

customerSupportRoutes.post("/", ProtectRoute, (req, res, next) => {
  createTicket(req, res).catch(next);
});

customerSupportRoutes.put("/:id", ProtectRoute, (req, res, next) => {
  updateTicket(req, res).catch(next);
});

customerSupportRoutes.delete("/:id", ProtectRoute, (req, res, next) => {
  deleteTicket(req, res).catch(next);
});

export default customerSupportRoutes;
