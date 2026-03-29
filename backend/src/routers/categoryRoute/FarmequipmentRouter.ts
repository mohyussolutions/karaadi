import { Router } from "express";
import { createFarmequipmentSchema } from "../../validation/Farmequipment.validation.ts";
import {
  getAllTractors,
  getAllTractorsIncludingUnpaid,
  getTotalTractors,
  getTractorById,
  updateTractor,
  deleteTractor,
  createfarmequipment,
} from "../../controllers/categoryController/FarmequipmentController.ts";
import {
  ProtectRoute,
  adminAndManager,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

const traktorRoutes = Router();

traktorRoutes.get("/", getAllTractors);
traktorRoutes.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllTractorsIncludingUnpaid,
);
traktorRoutes.get("/total", ProtectRoute, adminAndManager, getTotalTractors);
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
  validateRequest(createFarmequipmentSchema),
  updateTractor,
);
traktorRoutes.delete("/:id", ProtectRoute, deleteTractor);

export default traktorRoutes;
