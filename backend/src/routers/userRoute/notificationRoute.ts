import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  getNotificationStats,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../controllers/userController/notificationController.ts";
import express from "express";

const notificationRoutes = express.Router();

notificationRoutes.get("/user/:userId", getUserNotifications);
notificationRoutes.put("/:notificationId/read", markNotificationAsRead);
notificationRoutes.put("/user/:userId/read-all", markAllNotificationsAsRead);
notificationRoutes.post("/", createNotification);
notificationRoutes.delete("/:notificationId", deleteNotification);
notificationRoutes.get("/stats/:userId", getNotificationStats);

export default notificationRoutes;
