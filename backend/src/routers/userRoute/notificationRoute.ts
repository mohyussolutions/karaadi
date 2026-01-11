import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  getNotificationStats,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "controllers/userController/notificationController.ts";
import express from "express";

const router = express.Router();

router.get("/user/:userId", getUserNotifications);
router.put("/:notificationId/read", markNotificationAsRead);
router.put("/user/:userId/read-all", markAllNotificationsAsRead);
router.post("/", createNotification);
router.delete("/:notificationId", deleteNotification);
router.get("/stats/:userId", getNotificationStats);

export default router;
