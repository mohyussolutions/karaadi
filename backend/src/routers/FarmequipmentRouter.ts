import { Router } from "express";

import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  getAllTractors,
  getAllTractorsIncludingUnpaid,
  getTotalFarmEquipment,
  getTractorById,
  updateTractor,
  deleteTractor,
  createfarmequipment,
} from "src/controllers/FarmequipmentController.ts";
import {
  createFarmequipmentSchema,
  updateFarmequipmentSchema,
} from "src/validation/Farmequipment.validation.ts";

const traktorRoutes = Router();

traktorRoutes.get("/", getAllTractors);
traktorRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllTractorsIncludingUnpaid,
);
traktorRoutes.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  getTotalFarmEquipment,
);
traktorRoutes.get("/:id", getTractorById);
traktorRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createFarmequipmentSchema),
  createfarmequipment,
);
traktorRoutes.patch(
  "/:id",
  ProtectRoute,
  validateRequest(updateFarmequipmentSchema),
  updateTractor,
);
traktorRoutes.delete("/:id", ProtectRoute, deleteTractor);

export default traktorRoutes;
