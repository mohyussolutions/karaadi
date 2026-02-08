import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";

export const getAllAdvertisements = async (req: Request, res: Response) => {
  try {
    const { position, limit = 10 } = req.query;

    const whereClause: any = {
      isActive: true,
      AND: [
        {
          OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
        },
        {
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
      ],
    };

    if (position) {
      whereClause.position = position;
    }

    const ads = await prisma.advertisement.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: parseInt(limit as string),
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.json(ads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodayAdStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ads = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        createdAt: {
          gte: today,
        },
      },
      select: {
        views: true,
        clicks: true,
      },
    });

    const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    res.json({
      views: totalViews,
      clicks: totalClicks,
      ctr: parseFloat(ctr.toFixed(2)),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdvertisementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ad = await prisma.advertisement.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    if (!ad) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Increment views
    await prisma.advertisement.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.json(ad);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdvertisement = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      imageUrl,
      link,
      buttonText,
      position,
      priority,
      startDate,
      endDate,
      userId, // ADD THIS
    } = req.body;

    if (!title || !description || !imageUrl || !link || !userId) {
      return res.status(400).json({
        error:
          "Missing required fields. Title, description, imageUrl, link, and userId are required.",
      });
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const ad = await prisma.advertisement.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        buttonText: buttonText || "Learn More",
        position: position || "general",
        priority: priority || 1,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
        userId, // ADD THIS
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json(ad);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Check if ad exists
    const existingAd = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    const ad = await prisma.advertisement.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.json(ad);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if ad exists
    const existingAd = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    await prisma.advertisement.delete({
      where: { id },
    });

    res.json({ success: true, message: "Advertisement deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementAdClicks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if ad exists
    const existingAd = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAd) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    const ad = await prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    res.json({ success: true, clicks: ad.clicks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdStats = async (_req: Request, res: Response) => {
  try {
    const totalAds = await prisma.advertisement.count();
    const activeAds = await prisma.advertisement.count({
      where: { isActive: true },
    });
    const totalClicks = await prisma.advertisement.aggregate({
      _sum: { clicks: true },
    });
    const totalViews = await prisma.advertisement.aggregate({
      _sum: { views: true },
    });

    res.json({
      totalAds,
      activeAds,
      totalClicks: totalClicks._sum.clicks || 0,
      totalViews: totalViews._sum.views || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's advertisements
export const getUserAdvertisements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const ads = await prisma.advertisement.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.json(ads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
