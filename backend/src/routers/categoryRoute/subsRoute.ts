import express from "express";
import {
  createSubscription,
  deleteSubscriptionAdmin,
  getUserSubscriptions,
  getMySubscriptions,
  updateSubscriptionStatus,
  getAllSubscriptionsAdmin,
  getSubscriptionStats,
  getTotalSubscriptions,
  searchSubscriptions,
  triggerNotification,
  getAllSubscriptionPaid,
} from "../../controllers/categoryController/subscriptionController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const subscriptionRoute = express.Router();

subscriptionRoute.post("/", ProtectRoute, createSubscription);
subscriptionRoute.get("/user/:userId", ProtectRoute, getUserSubscriptions);
subscriptionRoute.get("/my", ProtectRoute, getMySubscriptions);
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
