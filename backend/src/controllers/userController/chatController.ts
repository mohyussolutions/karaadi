import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { EncryptionController } from "../encryptionController/encryptionController.ts";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, itemId, itemModel } = req.body;

    if (!senderId || !receiverId || !itemId || !itemModel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } }),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatData: any = { senderId, receiverId };

    switch (itemModel) {
      case "Marketplace":
        chatData.marketplaceId = itemId;
        break;
      case "Car":
        chatData.carId = itemId;
        break;
      case "Boat":
        chatData.boatId = itemId;
        break;
      case "Motorcycle":
        chatData.motorcycleId = itemId;
        break;
      case "RealEstate":
        chatData.realEstateId = itemId;
        break;
      case "Traktor":
        chatData.traktorId = itemId;
        break;
      default:
        return res.status(400).json({ error: "Invalid model" });
    }

    const existingChat = await prisma.chat.findFirst({
      where: chatData,
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        messages: { orderBy: { timestamp: "desc" }, take: 1 },
      },
    });

    if (existingChat) {
      const decryptedChat = {
        ...existingChat,
        messages: existingChat.messages.map((m) => ({
          ...m,
          content: EncryptionController.decrypt(m.content),
        })),
      };
      return res.status(200).json({ chat: decryptedChat, isNew: false });
    }

    const newChat = await prisma.chat.create({
      data: chatData,
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        messages: true,
      },
    });

    res.status(201).json({ chat: newChat, isNew: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chats = await prisma.chat.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        messages: { orderBy: { timestamp: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    const decryptedChats = chats.map((chat) => ({
      ...chat,
      messages: chat.messages.map((m) => ({
        ...m,
        content: EncryptionController.decrypt(m.content),
      })),
    }));

    res.json(decryptedChats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;

    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
    });
    if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      orderBy: { timestamp: "asc" },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
      },
    });

    const decryptedMessages = messages.map((m) => ({
      ...m,
      content: EncryptionController.decrypt(m.content),
    }));

    res.json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.query;
    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
    });
    if (!chat || (chat.senderId !== userId && chat.receiverId !== userId)) {
      return res.status(403).json({ error: "Access denied" });
    }
    await prisma.message.deleteMany({ where: { chatId: parseInt(chatId) } });
    await prisma.chat.delete({ where: { id: parseInt(chatId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chat = await prisma.chat.findUnique({
      where: { id: parseInt(chatId) },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
      },
    });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { userId, otherUserId } = req.query;
    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { senderId: userId as string, receiverId: otherUserId as string },
          { senderId: otherUserId as string, receiverId: userId as string },
        ],
      },
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
          include: {
            sender: { select: { id: true, username: true, email: true } },
          },
        },
      },
    });

    if (chat) {
      chat.messages = chat.messages.map((m) => ({
        ...m,
        content: EncryptionController.decrypt(m.content),
      }));
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { isArchived } = req.body;
    const updated = await prisma.chat.update({
      where: { id: parseInt(chatId) },
      data: { isArchived },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getArchivedChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        isArchived: true,
      },
      include: {
        sender: { select: { id: true, username: true, email: true } },
        receiver: { select: { id: true, username: true, email: true } },
      },
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllChatsAdmin = async (req: Request, res: Response) => {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        messages: { orderBy: { timestamp: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    const decryptedChats = chats.map((chat) => ({
      ...chat,
      messages: chat.messages.map((m) => ({
        ...m,
        content: EncryptionController.decrypt(m.content),
      })),
    }));

    res.json(decryptedChats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
