import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

import { getIO } from "services/sockets/socketServer.ts";
import { EncryptionController } from "controllers/encryptionController/encryptionController.ts";
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;

    if (!chatId || !userId) {
      return res.status(400).json({
        error: "Chat ID and User ID are required",
      });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
      select: { senderId: true, receiverId: true },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.senderId !== userId && chat.receiverId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      orderBy: { timestamp: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    const decryptedMessages = messages.map((msg) => ({
      ...msg,
      content: EncryptionController.decrypt(msg.content),
    }));

    await prisma.message.updateMany({
      where: {
        chatId: parseInt(chatId),
        receiverId: userId as string,
        read: false,
      },
      data: { read: true },
    });

    res.json(decryptedMessages);
  } catch (error: any) {
    console.error("Error getting chat messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    let { chatId, senderId, receiverId, content, imageUrl } = req.body;

    console.log("Received message request:", {
      chatId,
      senderId,
      receiverId,
      content: content?.substring(0, 50),
    });

    if (!chatId || !senderId || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["chatId", "senderId", "content"],
      });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
      select: { senderId: true, receiverId: true },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.senderId !== senderId && chat.receiverId !== senderId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // If receiverId is not provided, determine it from the chat
    if (!receiverId) {
      receiverId = chat.senderId === senderId ? chat.receiverId : chat.senderId;
      console.log("Determined receiverId from chat:", receiverId);
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const message = await prisma.message.create({
      data: {
        chatId: parseInt(chatId),
        senderId,
        receiverId,
        content: encryptedContent,
        imageUrl: imageUrl || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: {
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    const decryptedMessage = {
      ...message,
      content: EncryptionController.decrypt(message.content),
    };

    getIO().to(`chat_${chatId}`).emit("receiveMessage", decryptedMessage);
    getIO().to(`user_${receiverId}`).emit("newMessage", {
      chatId,
      message: decryptedMessage,
    });

    console.log("Message sent successfully:", message.id);
    res.status(201).json(decryptedMessage);
  } catch (error: any) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });

    res.json({ count });
  } catch (error: any) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    if (!chatId || !userId) {
      return res.status(400).json({
        error: "Chat ID and User ID are required",
      });
    }

    const updated = await prisma.message.updateMany({
      where: {
        chatId: parseInt(chatId),
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    getIO().to(`chat_${chatId}`).emit("messagesMarkedAsRead", {
      chatId,
      userId,
    });

    res.json({
      message: "Messages marked as read",
      count: updated.count,
    });
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const content = req.body?.content;
    const userId =
      req.body?.userId || req.query?.userId || (req as any).user?.id;

    if (!messageId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = await prisma.message.findUnique({
      where: { id: parseInt(messageId) },
    });

    if (!message || message.senderId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const updatedMessage = await prisma.message.update({
      where: { id: parseInt(messageId) },
      data: {
        content: encryptedContent,
        edited: true,
        editedAt: new Date(),
      },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
      },
    });

    const decryptedMessage = {
      ...updatedMessage,
      content: EncryptionController.decrypt(updatedMessage.content),
      isEdited: true,
    };

    getIO()
      .to(`chat_${updatedMessage.chatId}`)
      .emit("messageUpdated", decryptedMessage);

    res.json(decryptedMessage);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId =
      req.body?.userId || req.query?.userId || (req as any).user?.id;

    const message = await prisma.message.findUnique({
      where: { id: parseInt(messageId) },
    });

    if (
      !message ||
      (message.senderId !== userId && message.receiverId !== userId)
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedMessage = await prisma.message.update({
      where: { id: parseInt(messageId) },
      data: {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    getIO().to(`chat_${deletedMessage.chatId}`).emit("messageDeleted", {
      messageId: deletedMessage.id,
      chatId: deletedMessage.chatId,
    });

    res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const replyToMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { chatId, senderId, receiverId, content } = req.body;

    if (!messageId || !chatId || !senderId || !receiverId || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["messageId", "chatId", "senderId", "receiverId", "content"],
      });
    }

    const originalMessage = await prisma.message.findUnique({
      where: { id: parseInt(messageId) },
    });

    if (!originalMessage) {
      return res.status(404).json({ error: "Original message not found" });
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const reply = await prisma.message.create({
      data: {
        chatId: parseInt(chatId),
        senderId,
        receiverId,
        content: encryptedContent,
        replyToId: parseInt(messageId),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: {
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    const decryptedReply = {
      ...reply,
      content: EncryptionController.decrypt(reply.content),
    };

    getIO().to(`chat_${chatId}`).emit("receiveMessage", decryptedReply);
    getIO().to(`user_${receiverId}`).emit("newMessage", {
      chatId,
      message: decryptedReply,
    });

    res.status(201).json(decryptedReply);
  } catch (error: any) {
    console.error("Error replying to message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessageReplies = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.query;

    if (!messageId || !userId) {
      return res.status(400).json({
        error: "Message ID and User ID are required",
      });
    }

    const originalMessage = await prisma.message.findUnique({
      where: { id: parseInt(messageId) },
      include: {
        chat: {
          select: {
            senderId: true,
            receiverId: true,
          },
        },
      },
    });

    if (!originalMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (
      originalMessage.chat.senderId !== userId &&
      originalMessage.chat.receiverId !== userId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const replies = await prisma.message.findMany({
      where: {
        replyToId: parseInt(messageId),
        deleted: false,
      },
      orderBy: { timestamp: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    const decryptedReplies = replies.map((reply) => ({
      ...reply,
      content: EncryptionController.decrypt(reply.content),
    }));

    res.json(decryptedReplies);
  } catch (error: any) {
    console.error("Error getting message replies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
