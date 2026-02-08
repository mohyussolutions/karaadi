import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const unreadOnly = req.query.unreadOnly === "true";

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const skip = (page - 1) * limit;
    const whereCondition: any = { userId };
    if (unreadOnly) {
      whereCondition.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
      }),
      prisma.notification.count({ where: whereCondition }),
    ]);

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({
      success: true,
      notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    res.json({ success: true, updatedCount: result.count });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.create({
      data: req.body,
    });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [total, unread] = await Promise.all([
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    res.json({
      success: true,
      stats: {
        total,
        unread,
        read: total - unread,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
