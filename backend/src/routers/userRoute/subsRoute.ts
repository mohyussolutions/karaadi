// routes/subscription.routes.ts
import express from "express";
import {
  createSubscription,
  deleteSubscriptionAdmin,
  getAllSubscriptionsAdmin,
  getSubscriptionStats,
  getTotalSubscriptions,
  getUserSubscriptions,
  searchSubscriptions,
  triggerNotification,
  updateSubscriptionStatus,
} from "../../controllers/userController/subscriptionController.ts";

const subscriptionRoute = express.Router();

// User routes
subscriptionRoute.post("/", createSubscription);
subscriptionRoute.get("/user/:userId", getUserSubscriptions);
subscriptionRoute.get("/search", searchSubscriptions);

// Admin routes
subscriptionRoute.get("/admin/all", getAllSubscriptionsAdmin);
subscriptionRoute.delete("/admin/:id", deleteSubscriptionAdmin);
subscriptionRoute.patch("/admin/:id/status", updateSubscriptionStatus);
subscriptionRoute.post("/admin/notify", triggerNotification);

// Stats routes
subscriptionRoute.get("/stats", getSubscriptionStats);
subscriptionRoute.get("/total", getTotalSubscriptions);

export default subscriptionRoute;
