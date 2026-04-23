import { Router } from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  getAllMotorcycles,
  getMotorcycleById,
  createMotorcycle,
  updateMotorcycle,
  deleteMotorcycle,
  getTotalMotorcycles,
  getAllMotorcyclesIncludingUnpaid,
  updateMotorcyclePayment,
} from "src/controllers/motorcyclesController.ts";
import { createMotorcycleSchema } from "src/validation/motorcycles.validation.ts";

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
