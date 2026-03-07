import { Router } from "express";
import paymentController from "../../controllers/paymentController/PaymentController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const paymentRoutes = Router();
paymentRoutes.post("/", ProtectRoute, paymentController.createPayment);
paymentRoutes.get("/me", ProtectRoute, paymentController.getMyPayments);
paymentRoutes.get("/stats", ProtectRoute, paymentController.getPaymentStats);
paymentRoutes.get("/search", ProtectRoute, paymentController.searchPayments);
paymentRoutes.get("/item/:id", ProtectRoute, paymentController.getItemDetail);

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
