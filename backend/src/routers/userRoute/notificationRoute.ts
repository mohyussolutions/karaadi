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
const notificationRoutes = express.Router();
notificationRoutes.get("/user/:userId", getUserNotifications);
notificationRoutes.get("/all", getAllNotifications);
notificationRoutes.patch("/:notificationId/read", markNotificationAsRead);
notificationRoutes.patch("/user/:userId/read-all", markAllNotificationsAsRead);
notificationRoutes.post("/", createNotification);
notificationRoutes.delete("/:notificationId", deleteNotification);
notificationRoutes.delete("/user/:userId/clear-all", deleteAllNotifications);
notificationRoutes.get("/user/:userId/stats", getNotificationStats);
notificationRoutes.post(
  "/user/:userId/delivered",
  markNotificationsAsDelivered,
);
notificationRoutes.get(
  "/subscription/:subscriptionId",
  getSubscriptionNotifications,
);

export default notificationRoutes;
