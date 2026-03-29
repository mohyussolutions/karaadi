import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  getNotificationStats,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markNotificationsAsDelivered,
  getSubscriptionNotifications,
  deleteAllNotifications,
  getAllNotifications,
} from "../../controllers/userController/notificationController.ts";

import express from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { createNotificationSchema } from "../../validation/notification.validation.ts";
const notificationRoutes = express.Router();
notificationRoutes.get("/user/:userId", ProtectRoute, getUserNotifications);
notificationRoutes.get("/all", ProtectRoute, getAllNotifications);
notificationRoutes.patch(
  "/:notificationId/read",
  ProtectRoute,
  markNotificationAsRead,
);
notificationRoutes.patch(
  "/user/:userId/read-all",
  ProtectRoute,
  markAllNotificationsAsRead,
);
notificationRoutes.post(
  "/",
  ProtectRoute,
  validateRequest(createNotificationSchema),
  createNotification,
);
notificationRoutes.delete("/:notificationId", ProtectRoute, deleteNotification);
notificationRoutes.delete(
  "/user/:userId/clear-all",
  ProtectRoute,
  deleteAllNotifications,
);
notificationRoutes.get(
  "/user/:userId/stats",
  ProtectRoute,
  getNotificationStats,
);
notificationRoutes.post(
  "/user/:userId/delivered",
  ProtectRoute,
  markNotificationsAsDelivered,
);
notificationRoutes.get(
  "/subscription/:subscriptionId",
  getSubscriptionNotifications,
);

export default notificationRoutes;
