import express from "express";
import { validateRequest } from "src/core/middelware/validateRequest.ts";

import {
  createChat,
  getUserChats,
  deleteChat,
  getChatById,
  getConversation,
  updateChat,
  getArchivedChats,
  getChatMessages,
  getAllChatsAdmin,
} from "src/controllers/chatController.ts";
import {
  adminAndManager,
  ProtectRoute,
} from "src/core/middelware/authMiddlewareBothDbAndCognito.ts";
import { createChatSchema } from "src/validation/chat.validation.ts";

const chatRoutes = express.Router();

chatRoutes.post(
  "/create",
  ProtectRoute,
  validateRequest(createChatSchema),
  createChat,
);
chatRoutes.get("/user/:userId", ProtectRoute, getUserChats);
chatRoutes.get("/:chatId", ProtectRoute, getChatById);
chatRoutes.delete("/:chatId", ProtectRoute, deleteChat);
chatRoutes.get("/conversation/find", ProtectRoute, getConversation);
chatRoutes.put("/:chatId", ProtectRoute, updateChat);
chatRoutes.get("/user/:userId/archived", ProtectRoute, getArchivedChats);
chatRoutes.get("/:chatId/messages", ProtectRoute, getChatMessages);
chatRoutes.get("/admin/all", ProtectRoute, adminAndManager, getAllChatsAdmin);

export default chatRoutes;
