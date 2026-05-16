import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { EncryptionController } from "./encryptionController.ts";
import cacheManager from "src/services/redis/cacheManager.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
const chatCacheKey = (userId: string) => `chats:user:${userId}`;

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
      case "Job": {
        const includeOpts = {
          sender: {
            select: {
              id: true,
              username: true,
              profileImage: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              profileImage: true,
              email: true,
            },
          },
          messages: { orderBy: { timestamp: "desc" as const }, take: 1 },
        };
        const existingJobChat = await prisma.chat.findFirst({
          where: { senderId, receiverId, jobs: { some: { id: itemId } } },
          include: includeOpts,
        });
        if (existingJobChat) {
          const decrypted = {
            ...existingJobChat,
            messages: existingJobChat.messages.map((m) => ({
              ...m,
              content: EncryptionController.decrypt(m.content),
            })),
          };
          return res.status(200).json({ chat: decrypted, isNew: false });
        }
        const newJobChat = await prisma.chat.create({
          data: { senderId, receiverId, jobs: { connect: { id: itemId } } },
          include: { ...includeOpts, messages: true },
        });
        return res.status(201).json({ chat: newJobChat, isNew: true });
      }
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

    const chatInclude = {
      sender: {
        select: { id: true, username: true, profileImage: true, email: true },
      },
      receiver: {
        select: { id: true, username: true, profileImage: true, email: true },
      },
      messages: true,
    };

    const bustCache = () =>
      Promise.all([
        cacheManager.delete(chatCacheKey(senderId)),
        cacheManager.delete(chatCacheKey(receiverId)),
      ]);

    try {
      const newChat = await prisma.chat.create({
        data: chatData,
        include: chatInclude,
      });
      await bustCache();
      return res.status(201).json({ chat: newChat, isNew: true });
    } catch (err: any) {
      if (err?.code === "P2003") {
        const fallbackData = { senderId, receiverId };
        const existing = await prisma.chat.findFirst({
          where: fallbackData,
          include: chatInclude,
        });
        if (existing) {
          return res.status(200).json({ chat: existing, isNew: false });
        }
        const fallbackChat = await prisma.chat.create({
          data: fallbackData,
          include: chatInclude,
        });
        await bustCache();
        return res.status(201).json({ chat: fallbackChat, isNew: true });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;

    const cacheKey = chatCacheKey(userIdValue);
    const cached = await cacheManager.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const chats = await prisma.chat.findMany({
      where: { OR: [{ senderId: userIdValue }, { receiverId: userIdValue }] },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        receiver: {
          select: { id: true, username: true, profileImage: true, email: true },
        },
        messages: { orderBy: { timestamp: "desc" }, take: 1 },
        _count: {
          select: {
            messages: { where: { receiverId: userIdValue, read: false } },
          },
        },
        marketplace: {
          select: { id: true, title: true, price: true, images: true },
        },
        car: { select: { id: true, title: true, price: true, images: true } },
        boat: { select: { id: true, title: true, price: true, images: true } },
        motorcycle: {
          select: { id: true, title: true, price: true, images: true },
        },
        realEstate: {
          select: { id: true, title: true, price: true, images: true },
        },
        farmequipment: {
          select: { id: true, title: true, price: true, images: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const decryptedChats = chats.map((chat) => {
      const item =
        chat.marketplace ||
        chat.car ||
        chat.boat ||
        chat.motorcycle ||
        chat.realEstate ||
        chat.farmequipment ||
        null;
      return {
        ...chat,
        item,
        unreadCount: chat._count?.messages ?? 0,
        messages: chat.messages.map((m) => ({
          ...m,
          content: EncryptionController.decrypt(m.content),
        })),
      };
    });

    await cacheManager.set(cacheKey, decryptedChats, CACHE_TTL.CHAT);
    res.json(decryptedChats);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    if (isNaN(chatIdNum)) {
      return res.status(400).json({ error: "Invalid chat ID format" });
    }

    const userId = req.query.userId;
    const userIdValue = Array.isArray(userId) ? userId[0] : (userId as string);

    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
    });

    if (
      !chat ||
      (chat.senderId !== userIdValue && chat.receiverId !== userIdValue)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { chatId: chatIdNum },
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
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    if (isNaN(chatIdNum)) {
      return res.status(400).json({ error: "Invalid chat ID format" });
    }

    const userId = req.query.userId;
    const userIdValue = Array.isArray(userId) ? userId[0] : (userId as string);

    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
    });

    if (
      !chat ||
      (chat.senderId !== userIdValue && chat.receiverId !== userIdValue)
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.message.deleteMany({ where: { chatId: chatIdNum } });
    await prisma.chat.delete({ where: { id: chatIdNum } });

    await Promise.all([
      cacheManager.delete(chatCacheKey(chat.senderId)),
      cacheManager.delete(chatCacheKey(chat.receiverId)),
    ]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatById = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    if (isNaN(chatIdNum)) {
      return res.status(400).json({ error: "Invalid chat ID format" });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatIdNum },
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
    const userId = req.query.userId;
    const otherUserId = req.query.otherUserId;

    const userIdValue = Array.isArray(userId) ? userId[0] : (userId as string);
    const otherUserIdValue = Array.isArray(otherUserId)
      ? otherUserId[0]
      : (otherUserId as string);

    const chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { senderId: userIdValue, receiverId: otherUserIdValue },
          { senderId: otherUserIdValue, receiverId: userIdValue },
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
    const chatIdValue = Array.isArray(chatId) ? chatId[0] : chatId;
    const chatIdNum = parseInt(chatIdValue, 10);

    if (isNaN(chatIdNum)) {
      return res.status(400).json({ error: "Invalid chat ID format" });
    }

    const { isArchived } = req.body;
    const updated = await prisma.chat.update({
      where: { id: chatIdNum },
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
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: userIdValue }, { receiverId: userIdValue }],
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
