import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByUser,
  getPaymentStats,
  updatePaymentStatus,
  deletePayment,
  verifyPayment,
  getRecentPayments,
} from "../../controllers/paymentController/PaymentController.ts";

const paymentRoutes = Router();

paymentRoutes.post("/", createPayment);
paymentRoutes.get("/", getAllPayments);
paymentRoutes.get("/stats", getPaymentStats);
paymentRoutes.get("/recent", getRecentPayments);
paymentRoutes.get("/:id", getPaymentById);
paymentRoutes.put("/:id/status", updatePaymentStatus);
paymentRoutes.delete("/:id", deletePayment);
paymentRoutes.get("/user/:userId", getPaymentsByUser);
paymentRoutes.post("/verify", verifyPayment);

export default paymentRoutes;
