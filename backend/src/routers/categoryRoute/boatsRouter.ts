import { Router } from "express";

import { createBoatSchema } from "../../validation/boats.validation.ts";
import {
  getAllBoats,
  getBoatById,
  createBoat,
  updateBoat,
  deleteBoat,
  getTotalBoats,
  getAllBoatsIncludingUnpaid,
  updateBoatPayment,
} from "../../controllers/categoryController/boatsController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

const boatsRoutes = Router();

boatsRoutes.get("/total", ProtectRoute, adminAndManager, getTotalBoats);
boatsRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllBoatsIncludingUnpaid,
);
boatsRoutes.get("/", getAllBoats);
boatsRoutes.get("/:id", getBoatById);
boatsRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createBoatSchema),
  createBoat,
);
boatsRoutes.put("/:id/payment", updateBoatPayment);
boatsRoutes.put("/:id", validateRequest(createBoatSchema), updateBoat);
boatsRoutes.delete("/:id", deleteBoat);

export default boatsRoutes;
