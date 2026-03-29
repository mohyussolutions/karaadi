import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { getIO } from "../../services/sockets/socketServer.ts";

const includeSender = {
  sender: {
    select: { id: true, username: true, email: true, profileImage: true },
  },
};

const includeSubscription = {
  subscription: {
    select: {
      id: true,
      title: true,
      category: true,
      subCategory: true,
      region: true,
      cities: true,
      priceMin: true,
      priceMax: true,
      brand: true,
      model: true,
      condition: true,
    },
  },
};

const includeItem = {
  select: {
    id: true,
    title: true,
    price: true,
    images: true,
    region: true,
    city: true,
    brand: true,
    boatModel: true,
    type: true,
  },
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;

    const page = typeof req.query.page === "string" ? req.query.page : "1";
    const limit = typeof req.query.limit === "string" ? req.query.limit : "20";

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: userIdValue },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { id: true, username: true, profileImage: true } },
          subscription: {
            select: {
              id: true,
              title: true,
              category: true,
              subCategory: true,
              region: true,
              cities: true,
              priceMin: true,
              priceMax: true,
              brand: true,
              model: true,
            },
          },
        },
        skip,
        take: limitNum,
      }),
      prisma.notification.count({ where: { userId: userIdValue } }),
    ]);

    const notificationsWithItems = await Promise.all(
      notifications.map(async (notification) => {
        if (notification.itemId && notification.itemType) {
          let item = null;
          switch (notification.itemType) {
            case "boat":
              item = await prisma.boat.findUnique({
                where: { id: notification.itemId },
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                  region: true,
                  city: true,

                  boatModel: true,
                  type: true,
                },
              });
              break;
            case "car":
              item = await prisma.car.findUnique({
                where: { id: notification.itemId },
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                  region: true,
                  city: true,
                  brand: true,
                },
              });
              break;
            case "realestate":
              item = await prisma.realEstate.findUnique({
                where: { id: notification.itemId },
                select: {
                  id: true,
                  title: true,
                  price: true,
                  images: true,
                  region: true,
                  city: true,
                },
              });
              break;
          }
          return { ...notification, item };
        }
        return notification;
      }),
    );

    res.json({
      success: true,
      notifications: notificationsWithItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, profileImage: true } },
        subscription: {
          select: {
            id: true,
            title: true,
            category: true,
            region: true,
            cities: true,
          },
        },
        user: { select: { id: true, username: true, email: true } },
      },
      take: 100,
    });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all notifications" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const id = Array.isArray(notificationId)
      ? notificationId[0]
      : notificationId;

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
      include: { ...includeSender, ...includeSubscription },
    });

    const io = getIO();
    if (io && updated.userId) {
      io.to(`user_${updated.userId}`).emit("notificationRead", {
        notificationId: updated.id,
        readAt: updated.readAt,
      });
    }

    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    const whereCondition: any = { userId: userIdValue, isRead: false };
    if (category) whereCondition.category = category;

    const result = await prisma.notification.updateMany({
      where: whereCondition,
      data: { isRead: true, readAt: new Date() },
    });

    const io = getIO();
    if (io) {
      io.to(`user_${userIdValue}`).emit("allNotificationsRead", {
        count: result.count,
        category: category || "all",
        readAt: new Date(),
      });
    }

    res.json({ success: true, updatedCount: result.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};

export const createSubscriptionNotification = async (subscription: any) => {
  try {
    console.log(
      `Subscription created: ${subscription.id} for user ${subscription.userId}`,
    );

    const io = getIO();
    if (io) {
      io.to(`user_${subscription.userId}`).emit("subscriptionCreated", {
        subscriptionId: subscription.id,
        title: subscription.title,
        message: `Your subscription "${subscription.title}" has been created successfully`,
      });
    }
  } catch (error) {
    console.error("Failed to send subscription confirmation:", error);
  }
};

export const createItemMatchNotifications = async (
  itemType: string,
  itemId: string,
  itemDetails: {
    title: string;
    price: number;
    mainCategory: string;
    subCategory?: string;
    region: string;
    city: string;
    brand?: string;
    model?: string;
    posterId: string;
  },
) => {
  try {
    const {
      title,
      price,
      mainCategory,
      subCategory,
      region,
      city,
      brand,
      model,
      posterId,
    } = itemDetails;

    const matchingSubscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        userId: { not: posterId },
        AND: [
          {
            OR: [
              { category: { equals: mainCategory, mode: "insensitive" } },
              { category: { contains: mainCategory, mode: "insensitive" } },
            ],
          },
          {
            OR: [{ region: { equals: region, mode: "insensitive" } }],
          },
          {
            OR: [{ cities: { has: city } }, { cities: { isEmpty: true } }],
          },
          {
            OR: [{ priceMin: null }, { priceMin: { lte: price } }],
          },
          {
            OR: [{ priceMax: null }, { priceMax: { gte: price } }],
          },
        ],
      },
      select: {
        id: true,
        userId: true,
        title: true,
      },
      take: 1000,
    });

    if (!matchingSubscriptions.length) {
      return { success: true, count: 0 };
    }

    const notificationsData = matchingSubscriptions.map((sub) => ({
      userId: sub.userId,
      senderId: posterId,
      subscriptionId: sub.id,
      title: `New ${itemType} matches your subscription: ${sub.title}`,
      message: `A new ${itemType} "${title}" is available in ${city}${price ? ` for $${price}` : ""}`,
      category: "subscription_alert",
      subCategory: mainCategory,
      itemId,
      itemType,
      region,
      city,
      metadata: {
        itemTitle: title,
        itemPrice: price,
        itemBrand: brand,
        itemModel: model,
        subscriptionTitle: sub.title,
      },
    }));

    await prisma.notification.createMany({
      data: notificationsData,
      skipDuplicates: true,
    });

    await prisma.subscription.updateMany({
      where: {
        id: { in: matchingSubscriptions.map((s) => s.id) },
      },
      data: {
        notificationCount: { increment: 1 },
        lastNotified: new Date(),
      },
    });

    const createdNotifications = await prisma.notification.findMany({
      where: {
        itemId,
        subscriptionId: { in: matchingSubscriptions.map((s) => s.id) },
        createdAt: { gte: new Date(Date.now() - 5000) },
      },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true },
        },
        subscription: {
          select: {
            id: true,
            title: true,
            category: true,
            subCategory: true,
          },
        },
      },
    });

    const io = getIO();
    if (io) {
      const notificationsByUser = createdNotifications.reduce(
        (acc, notification) => {
          if (!acc[notification.userId]) {
            acc[notification.userId] = [];
          }
          acc[notification.userId].push(notification);
          return acc;
        },
        {} as Record<string, typeof createdNotifications>,
      );

      Object.entries(notificationsByUser).forEach(([userId, notifications]) => {
        io.to(`user_${userId}`).emit("newNotifications", notifications);
      });
    }

    return { success: true, count: matchingSubscriptions.length };
  } catch (error) {
    console.error("Error creating item match notifications:", error);
    return { success: false, error };
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      message,
      category,
      subCategory,
      itemId,
      itemType,
      region,
      city,
      metadata,
    } = req.body;

    if (!userId || !title || !message || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        senderId: req.body.senderId,
        subscriptionId: req.body.subscriptionId,
        title,
        message,
        category,
        subCategory,
        itemId,
        itemType,
        region,
        city,
        metadata: metadata || undefined,
        isRead: false,
        isDelivered: false,
      },
      include: { ...includeSender, ...includeSubscription },
    });

    const io = getIO();
    if (io) {
      io.to(`user_${userId}`).emit("newNotification", notification);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: "Failed to create" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const id = Array.isArray(notificationId)
      ? notificationId[0]
      : notificationId;

    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!notification) return res.status(404).json({ error: "Not found" });

    await prisma.notification.delete({ where: { id } });

    const io = getIO();
    if (io) {
      io.to(`user_${notification.userId}`).emit("notificationDeleted", {
        notificationId: id,
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    const whereCondition: any = { userId: userIdValue };
    if (category) whereCondition.category = category;

    const result = await prisma.notification.deleteMany({
      where: whereCondition,
    });

    const io = getIO();
    if (io) {
      io.to(`user_${userIdValue}`).emit("allNotificationsDeleted", {
        count: result.count,
        category: category || "all",
      });
    }

    res.json({ success: true, deletedCount: result.count });
  } catch (error) {
    res.status(500).json({ error: "Delete all failed" });
  }
};

export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;

    const [total, unread] = await Promise.all([
      prisma.notification.count({ where: { userId: userIdValue } }),
      prisma.notification.count({
        where: { userId: userIdValue, isRead: false },
      }),
    ]);

    res.json({ success: true, stats: { total, unread, read: total - unread } });
  } catch (error) {
    res.status(500).json({ error: "Stats failed" });
  }
};

export const markNotificationsAsDelivered = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;
    const { notificationIds } = req.body;

    const whereCondition: any = { userId: userIdValue };
    if (
      notificationIds &&
      Array.isArray(notificationIds) &&
      notificationIds.length > 0
    ) {
      whereCondition.id = { in: notificationIds };
    } else {
      whereCondition.isDelivered = false;
    }

    const result = await prisma.notification.updateMany({
      where: whereCondition,
      data: { isDelivered: true },
    });

    res.json({ success: true, updatedCount: result.count });
  } catch (error) {
    res.status(500).json({ error: "Delivered update failed" });
  }
};

export const getSubscriptionNotifications = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subscriptionId } = req.params;
    const id = Array.isArray(subscriptionId)
      ? subscriptionId[0]
      : subscriptionId;

    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { subscriptionId: id },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          sender: {
            select: { id: true, username: true, profileImage: true },
          },
        },
      }),
      prisma.notification.count({ where: { subscriptionId: id } }),
    ]);

    res.json({
      success: true,
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

export const getNotificationsBySubscription = async (
  req: Request,
  res: Response,
) => {
  try {
    const { subscriptionId } = req.params;
    const id = Array.isArray(subscriptionId)
      ? subscriptionId[0]
      : subscriptionId;

    const notifications = await prisma.notification.findMany({
      where: { subscriptionId: id },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { id: true, username: true, profileImage: true },
        },
      },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        category: true,
        subCategory: true,
        region: true,
        cities: true,
        priceMin: true,
        priceMax: true,
        brand: true,
        model: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      subscription,
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
};
