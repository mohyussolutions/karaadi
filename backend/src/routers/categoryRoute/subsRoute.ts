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
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";

const subscriptionRoute = express.Router();

subscriptionRoute.post("/", createSubscription);
subscriptionRoute.get("/user/:userId", getUserSubscriptions);
subscriptionRoute.get("/my", ProtectRoute, getMySubscriptions);
subscriptionRoute.get("/search", searchSubscriptions);

subscriptionRoute.get("/admin/all", getAllSubscriptionsAdmin);
subscriptionRoute.delete("/admin/:id", deleteSubscriptionAdmin);
subscriptionRoute.patch("/admin/:id/status", updateSubscriptionStatus);
subscriptionRoute.post("/admin/notify", triggerNotification);
subscriptionRoute.get("/allpaid", getAllSubscriptionPaid);
subscriptionRoute.get("/stats", getSubscriptionStats);
subscriptionRoute.get("/total", getTotalSubscriptions);

export default subscriptionRoute;
