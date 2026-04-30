import express from "express";
import {
  createBusiness,
  getMyBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  addMember,
  removeMember,
  getAllBusinessesAdmin,
  updateBusinessStatus,
  getBusinessStats,
  getTotalBusinesses,
  canPostAsBusiness,
  selectPlan,
  extendPlan,
  toggleAdminEnabled,
  getBusinessFeed,
  getAllBusinesses,
  adminAssignPlan,
  adminSetPostLimit,
} from "src/controllers/businessController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createBusinessSchema,
  updateBusinessStatusSchema,
  extendBusinessPlanSchema,
  toggleAdminEnabledSchema,
} from "src/validation/business.validation.ts";

const businessRoute = express.Router();

businessRoute.get("/", getAllBusinesses);
businessRoute.post(
  "/",
  ProtectRoute,
  validateRequest(createBusinessSchema),
  createBusiness,
);
businessRoute.get("/feed", getBusinessFeed);
businessRoute.get("/my", ProtectRoute, getMyBusinesses);
businessRoute.get("/can-post", ProtectRoute, canPostAsBusiness);
businessRoute.get("/stats", ProtectRoute, adminAndManager, getBusinessStats);
businessRoute.get("/total", ProtectRoute, adminAndManager, getTotalBusinesses);
businessRoute.get(
  "/admin/all",
  ProtectRoute,
  adminAndManager,
  getAllBusinessesAdmin,
);
businessRoute.patch(
  "/admin/:id/status",
  ProtectRoute,
  adminAndManager,
  validateRequest(updateBusinessStatusSchema),
  updateBusinessStatus,
);
businessRoute.patch(
  "/admin/:id/toggle-visibility",
  ProtectRoute,
  adminAndManager,
  validateRequest(toggleAdminEnabledSchema),
  toggleAdminEnabled,
);
businessRoute.patch(
  "/admin/:id/assign-plan",
  ProtectRoute,
  adminAndManager,
  adminAssignPlan,
);
businessRoute.patch(
  "/admin/:id/post-limit",
  ProtectRoute,
  adminAndManager,
  adminSetPostLimit,
);
businessRoute.get("/:id", ProtectRoute, getBusinessById);
businessRoute.patch("/:id", ProtectRoute, updateBusiness);
businessRoute.delete("/:id", ProtectRoute, deleteBusiness);
businessRoute.post("/:id/select-plan", ProtectRoute, selectPlan);
businessRoute.post(
  "/:id/extend-plan",
  ProtectRoute,
  validateRequest(extendBusinessPlanSchema),
  extendPlan,
);
businessRoute.post("/:id/members", ProtectRoute, addMember);
businessRoute.delete("/:id/members/:memberId", ProtectRoute, removeMember);

export default businessRoute;
