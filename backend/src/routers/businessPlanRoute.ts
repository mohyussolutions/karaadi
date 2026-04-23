import express from "express";
import {
  getAllBusinessPlans,
  getBusinessPlanById,
  createBusinessPlan,
  updateBusinessPlan,
  deleteBusinessPlan,
} from "src/controllers/businessPlanController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const businessPlanRoute = express.Router();

businessPlanRoute.get("/", getAllBusinessPlans);
businessPlanRoute.get(
  "/admin/all",
  ProtectRoute,
  adminAndManager,
  getAllBusinessPlans,
);
businessPlanRoute.get("/:id", getBusinessPlanById);
businessPlanRoute.post("/", ProtectRoute, adminAndManager, createBusinessPlan);
businessPlanRoute.patch(
  "/:id",
  ProtectRoute,
  adminAndManager,
  updateBusinessPlan,
);
businessPlanRoute.delete(
  "/:id",
  ProtectRoute,
  adminAndManager,
  deleteBusinessPlan,
);

export default businessPlanRoute;
