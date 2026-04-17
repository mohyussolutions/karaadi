import express from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";
import { sendMessageSchema } from "../../validation/message.validation.ts";
import {
  getChatMessages,
  sendMessage,
  getUnreadCount,
  markAllAsRead,
  deleteMessage,
  updateMessage,
  replyToMessage,
  getMessageReplies,
} from "../../controllers/userController/messageController.ts";
import { ProtectRoute } from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
ProtectRoute;

const messageRoutes = express.Router();

messageRoutes.get("/:chatId/messages", ProtectRoute, getChatMessages);
messageRoutes.post(
  "/send",
  ProtectRoute,
  validateRequest(sendMessageSchema),
  sendMessage,
);
messageRoutes.get("/unread/:userId", ProtectRoute, getUnreadCount);
messageRoutes.post("/:chatId/read-all", ProtectRoute, markAllAsRead);
messageRoutes.delete("/:messageId", ProtectRoute, deleteMessage);
messageRoutes.put("/:messageId", ProtectRoute, updateMessage);
messageRoutes.post("/:messageId/reply", ProtectRoute, replyToMessage);
messageRoutes.get("/:messageId/replies", ProtectRoute, getMessageReplies);
export default messageRoutes;
