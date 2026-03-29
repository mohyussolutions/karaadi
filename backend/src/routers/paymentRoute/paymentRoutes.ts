import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { paymentValidation } from "../../validation/payment.validation.ts";
import paymentController from "../../controllers/paymentController/PaymentController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const paymentRoutes = Router();

paymentRoutes.get("/item/:id", paymentController.getItemDetail);
paymentRoutes.get("/me", ProtectRoute, paymentController.getMyPayments);
paymentRoutes.get("/stats", ProtectRoute, paymentController.getPaymentStats);
paymentRoutes.get("/search", ProtectRoute, paymentController.searchPayments);
paymentRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(paymentValidation),
  paymentController.createPayment,
);
paymentRoutes.post(
  "/card/create-intent",
  ProtectRoute,
  validateRequest(paymentValidation),
  paymentController.createCardPaymentIntent,
);
paymentRoutes.post(
  "/card/confirm",
  ProtectRoute,
  paymentController.confirmCardPayment,
);
paymentRoutes.post(
  "/card/refund",
  ProtectRoute,
  adminAndManager,
  paymentController.refundCardPayment,
);
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
