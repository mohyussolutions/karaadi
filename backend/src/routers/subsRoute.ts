import express from "express";

import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import {
  createSubscription,
  deleteSubscriptionAdmin,
  deleteMySubscription,
  getUserSubscriptions,
  getMySubscriptions,
  updateSubscriptionStatus,
  getAllSubscriptionsAdmin,
  getSubscriptionStats,
  getTotalSubscriptions,
  searchSubscriptions,
  triggerNotification,
  getAllSubscriptionPaid,
} from "src/controllers/subscriptionController.ts";
import { createSubscriptionSchema } from "src/validation/subscription.validation.ts";
import { updateSubscriptionStatusSchema } from "src/validation/updateSubscriptionStatus.validation.ts";

const subscriptionRoute = express.Router();

subscriptionRoute.post(
  "/",
  ProtectRoute,
  validateRequest(createSubscriptionSchema),
  createSubscription,
);
subscriptionRoute.get("/user/:userId", ProtectRoute, getUserSubscriptions);
subscriptionRoute.get("/my", ProtectRoute, getMySubscriptions);
subscriptionRoute.delete("/:id", ProtectRoute, deleteMySubscription);
subscriptionRoute.get("/search", searchSubscriptions);

subscriptionRoute.get(
  "/admin/all",
  ProtectRoute,
  adminAndManager,
  getAllSubscriptionsAdmin,
);
subscriptionRoute.delete(
  "/admin/:id",
  ProtectRoute,

  deleteSubscriptionAdmin,
);
subscriptionRoute.patch(
  "/admin/:id/status",
  ProtectRoute,
  adminAndManager,
  validateRequest(updateSubscriptionStatusSchema),
  updateSubscriptionStatus,
);
subscriptionRoute.post("/admin/notify", ProtectRoute, triggerNotification);
subscriptionRoute.get("/allpaid", ProtectRoute, getAllSubscriptionPaid);
subscriptionRoute.get(
  "/stats",
  ProtectRoute,
  adminAndManager,
  getSubscriptionStats,
);
subscriptionRoute.get(
  "/total",
  ProtectRoute,
  adminAndManager,
  getTotalSubscriptions,
);

export default subscriptionRoute;
