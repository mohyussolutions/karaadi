import express from "express";
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
} from "../../controllers/userController/chatController.ts";

const chatRoutes = express.Router();

chatRoutes.post("/create", createChat);
chatRoutes.get("/user/:userId", getUserChats);
chatRoutes.get("/:chatId", getChatById);
chatRoutes.delete("/:chatId", deleteChat);
chatRoutes.get("/conversation/find", getConversation);
chatRoutes.put("/:chatId", updateChat);
chatRoutes.get("/user/:userId/archived", getArchivedChats);
chatRoutes.get("/:chatId/messages", getChatMessages);
chatRoutes.get("/admin/all", getAllChatsAdmin);

export default chatRoutes;
