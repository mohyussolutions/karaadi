import express from "express";
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

const messageRoutes = express.Router();

messageRoutes.get("/:chatId/messages", getChatMessages);
messageRoutes.post("/send", sendMessage);
messageRoutes.get("/unread/:userId", getUnreadCount);
messageRoutes.post("/:chatId/read-all", markAllAsRead);
messageRoutes.delete("/:messageId", deleteMessage);
messageRoutes.put("/:messageId", updateMessage);
messageRoutes.post("/:messageId/reply", replyToMessage);
messageRoutes.get("/:messageId/replies", getMessageReplies);

export default messageRoutes;
