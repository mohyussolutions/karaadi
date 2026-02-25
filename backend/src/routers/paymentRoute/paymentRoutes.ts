import { Router } from "express";
import paymentController from "../../controllers/paymentController/PaymentController.ts";
import { ProtectRoute } from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const paymentRoutes = Router();

paymentRoutes.get("/", paymentController.getAllPayments);
paymentRoutes.get("/stats", paymentController.getPaymentStats);
paymentRoutes.get("/search", paymentController.searchPayments);
paymentRoutes.get("/me", ProtectRoute, paymentController.getMyPayments);
paymentRoutes.get("/item/:id", paymentController.getItemDetail);
paymentRoutes.get("/:id", paymentController.getPaymentById);
paymentRoutes.post("/", paymentController.createPayment);
paymentRoutes.put("/:id/status", paymentController.updatePaymentStatus);
paymentRoutes.delete("/:id", paymentController.deletePayment);

export default paymentRoutes;
