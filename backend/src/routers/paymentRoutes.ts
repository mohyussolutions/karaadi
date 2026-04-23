import { Router } from "express";
import paymentController from "src/controllers/PaymentController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const paymentRoutes = Router();

paymentRoutes.get(
  "/analytics/revenue-by-month",
  ProtectRoute,
  adminAndManager,
  paymentController.revenueByMonth,
);
paymentRoutes.get("/item/:id", paymentController.getItemDetail);
paymentRoutes.get("/me", ProtectRoute, paymentController.getMyPayments);
paymentRoutes.get("/stats", ProtectRoute, paymentController.getPaymentStats);
paymentRoutes.get("/search", ProtectRoute, paymentController.searchPayments);
paymentRoutes.get(
  "/",
  ProtectRoute,
  adminAndManager,
  paymentController.getAllPayments,
);
paymentRoutes.get(
  "/:id",
  ProtectRoute,
  adminAndManager,
  paymentController.getPaymentById,
);
paymentRoutes.post("/", ProtectRoute, paymentController.createPayment);
paymentRoutes.put(
  "/:id/status",
  ProtectRoute,
  adminAndManager,
  paymentController.updatePaymentStatus,
);
paymentRoutes.delete(
  "/:id",
  ProtectRoute,
  adminAndManager,
  paymentController.deletePayment,
);

export default paymentRoutes;
