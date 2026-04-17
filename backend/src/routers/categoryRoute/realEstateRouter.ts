import { Router } from "express";
import {
  adminAndManager,
  ProtectRoute,
} from "../../core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createRealEstate,
  deleteRealEstate,
  getAllRealEstates,
  getAllRealEstatesIncludingUnpaid,
  getRealEstateById,
  getTotalRealEstates,
  updateRealEstate,
  updateRealEstatePayment,
} from "../../controllers/categoryController/realEstateController.ts";
import {
  createRealEstateSchema,
  updateRealEstateSchema,
} from "../../validation/updateRealEstate.validation.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

const realEstateRouter = Router();

realEstateRouter.patch(
  "/:id/payment",
  ProtectRoute,
  adminAndManager,
  updateRealEstatePayment,
);

realEstateRouter.get("/", getAllRealEstates);

realEstateRouter.get(
  "/all-including-unpaid",
  ProtectRoute,
  adminAndManager,
  getAllRealEstatesIncludingUnpaid,
);

realEstateRouter.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  getTotalRealEstates,
);

realEstateRouter.get("/:id", getRealEstateById);

realEstateRouter.post(
  "/",
  ProtectRoute,
  validateRequest(createRealEstateSchema),
  createRealEstate,
);

realEstateRouter.patch(
  "/:id",
  ProtectRoute,
  validateRequest(updateRealEstateSchema),
  updateRealEstate,
);

realEstateRouter.delete("/:id", ProtectRoute, deleteRealEstate);

export default realEstateRouter;
