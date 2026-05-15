import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { EncryptionController } from "./encryptionController.ts";
import { getIO } from "src/services/sockets/socketServer.ts";
import cacheManager from "src/services/redis/cacheManager.ts";
import { sendPushToUser } from "src/services/pushNotificationService.ts";

const chatCacheKey = (userId: string) => `chats:user:${userId}`;

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    const userId = req.query.userId;
    const userIdValue = Array.isArray(userId) ? userId[0] : (userId as string);

    if (!chatIdNum || !userIdValue) {
      return res.status(400).json({
        error: "Chat ID and User ID are required",
      });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
      select: { senderId: true, receiverId: true },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.senderId !== userIdValue && chat.receiverId !== userIdValue) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatIdNum },
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
        chatId: chatIdNum,
        receiverId: userIdValue,
        read: false,
      },
      data: { read: true },
    });

    res.json(decryptedMessages);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    let { chatId, senderId, receiverId, content, imageUrl } = req.body;

    if (!chatId || !senderId || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["chatId", "senderId", "content"],
      });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId, 10) },
      select: { senderId: true, receiverId: true },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    if (chat.senderId !== senderId && chat.receiverId !== senderId) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!receiverId) {
      receiverId = chat.senderId === senderId ? chat.receiverId : chat.senderId;
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const message = await prisma.message.create({
      data: {
        chatId: parseInt(chatId, 10),
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
      where: { id: parseInt(chatId, 10) },
      data: {
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    await Promise.all([
      cacheManager.delete(chatCacheKey(senderId)),
      cacheManager.delete(chatCacheKey(receiverId)),
    ]);

    const decryptedMessage = {
      ...message,
      content: EncryptionController.decrypt(message.content),
    };

    getIO().to(`chat_${chatId}`).emit("receiveMessage", decryptedMessage);
    getIO().to(`user_${receiverId}`).emit("newMessage", {
      chatId,
      message: decryptedMessage,
    });

    sendPushToUser(receiverId, {
      title: message.sender?.username || "New message",
      body: decryptedMessage.content.slice(0, 100),
      icon: "/logo.jpg",
      url: `/messages/${chatId}`,
      tag: `chat-${chatId}`,
    }).catch(() => {});

    res.status(201).json(decryptedMessage);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;

    if (!userIdValue) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const count = await prisma.message.count({
      where: {
        receiverId: userIdValue,
        read: false,
      },
    });

    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    const { userId } = req.body;

    if (!chatIdNum || !userId) {
      return res.status(400).json({
        error: "Chat ID and User ID are required",
      });
    }

    const updated = await prisma.message.updateMany({
      where: {
        chatId: chatIdNum,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    getIO().to(`chat_${chatIdNum}`).emit("messagesMarkedAsRead", {
      chatId: chatIdNum,
      userId,
    });

    res.json({
      message: "Messages marked as read",
      count: updated.count,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const messageIdValue = Array.isArray(messageId) ? messageId[0] : messageId;
    const messageIdNum = parseInt(messageIdValue, 10);

    const content = req.body?.content;
    const userId =
      req.body?.userId || req.query?.userId || (req as any).user?.id;

    if (!messageIdNum || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = await prisma.message.findUnique({
      where: { id: messageIdNum },
    });

    if (!message || message.senderId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const updatedMessage = await prisma.message.update({
      where: { id: messageIdNum },
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
    const messageIdValue = Array.isArray(messageId) ? messageId[0] : messageId;
    const messageIdNum = parseInt(messageIdValue, 10);

    const userId =
      req.body?.userId || req.query?.userId || (req as any).user?.id;

    const message = await prisma.message.findUnique({
      where: { id: messageIdNum },
    });

    if (
      !message ||
      (message.senderId !== userId && message.receiverId !== userId)
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedMessage = await prisma.message.update({
      where: { id: messageIdNum },
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
    const messageIdValue = Array.isArray(messageId) ? messageId[0] : messageId;
    const messageIdNum = parseInt(messageIdValue, 10);

    const { chatId, senderId, receiverId, content } = req.body;

    if (!messageIdNum || !chatId || !senderId || !receiverId || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["messageId", "chatId", "senderId", "receiverId", "content"],
      });
    }

    const originalMessage = await prisma.message.findUnique({
      where: { id: messageIdNum },
    });

    if (!originalMessage) {
      return res.status(404).json({ error: "Original message not found" });
    }

    const encryptedContent = EncryptionController.encrypt(content);

    const reply = await prisma.message.create({
      data: {
        chatId: parseInt(chatId, 10),
        senderId,
        receiverId,
        content: encryptedContent,
        replyToId: messageIdNum,
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
      where: { id: parseInt(chatId, 10) },
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
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessageReplies = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const messageIdValue = Array.isArray(messageId) ? messageId[0] : messageId;
    const messageIdNum = parseInt(messageIdValue, 10);

    const userId = req.query.userId;
    const userIdValue = Array.isArray(userId) ? userId[0] : (userId as string);

    if (!messageIdNum || !userIdValue) {
      return res.status(400).json({
        error: "Message ID and User ID are required",
      });
    }

    const originalMessage = await prisma.message.findUnique({
      where: { id: messageIdNum },
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
      originalMessage.chat.senderId !== userIdValue &&
      originalMessage.chat.receiverId !== userIdValue
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const replies = await prisma.message.findMany({
      where: {
        replyToId: messageIdNum,
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
    res.status(500).json({ error: "Internal server error" });
  }
};
