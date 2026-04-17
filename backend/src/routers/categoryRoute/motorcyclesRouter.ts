import { updateMotorcyclePayment } from "../../controllers/categoryController/motorcyclesController.ts";
import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { createMotorcycleSchema } from "../../validation/motorcycles.validation.ts";
import {
  getAllMotorcycles,
  getMotorcycleById,
  createMotorcycle,
  updateMotorcycle,
  deleteMotorcycle,
  getTotalMotorcycles,
  getAllMotorcyclesIncludingUnpaid,
} from "../../controllers/categoryController/motorcyclesController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";

const motorcyclesRoutes = Router();

motorcyclesRoutes.get("/", getAllMotorcycles);

motorcyclesRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllMotorcyclesIncludingUnpaid,
);

motorcyclesRoutes.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  getTotalMotorcycles,
);

motorcyclesRoutes.get("/:id", ProtectRoute, getMotorcycleById);

motorcyclesRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createMotorcycleSchema),
  createMotorcycle,
);

motorcyclesRoutes.delete("/:id", ProtectRoute, deleteMotorcycle);

motorcyclesRoutes.patch(
  "/:id/payment",
  ProtectRoute,
  adminAndManager,
  updateMotorcyclePayment,
);

motorcyclesRoutes.put(
  "/:id",
  ProtectRoute,
  validateRequest(createMotorcycleSchema),
  updateMotorcycle,
);

export default motorcyclesRoutes;
