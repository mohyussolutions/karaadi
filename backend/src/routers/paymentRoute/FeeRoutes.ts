import {
  createFeeConfig,
  getFeeHistory,
  getActiveFee,
  calculateTotalFee,
  updateFeeWithLog,
  deleteFeeConfig,
} from "../../controllers/paymentController/FeeController.ts";
import { Router } from "express";

const FeeRoutes = Router();

FeeRoutes.post("/", createFeeConfig);
FeeRoutes.get("/", getFeeHistory);
FeeRoutes.get("/active", getActiveFee);
FeeRoutes.get("/calculate", calculateTotalFee);
FeeRoutes.patch("/:id", updateFeeWithLog);
FeeRoutes.delete("/:id", deleteFeeConfig);

export default FeeRoutes;
