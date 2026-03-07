import { Request, Response } from "express";
import { ItemCategory } from "@prisma/client";
import prisma from "src/core/utils/db.ts";

export const createReport = async (req: Request, res: Response) => {
  try {
    console.log("Headers:", req.headers.authorization);
    console.log("User from request:", (req as any).user);

    const { reason, details, description, itemType, itemId } = req.body;
    const user = (req as any).user;
    const reporterId = user?.id;

    if (!reporterId) {
      return res.status(401).json({
        error: "User not authenticated",
        debug: "No user found in request. Token may be missing or invalid.",
      });
    }

    if (!reason || !itemType || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const report = await prisma.report.create({
      data: {
        reason,
        details: details || null,
        description: description || null,
        itemType,
        itemId,
        reporterId,
        status: "NEW",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (err: any) {
    console.error("Create report error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "10";
    const status = req.query.status as string;
    const itemType = req.query.itemType as ItemCategory;
    const search = req.query.search as string;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const where: any = {};

    if (status) where.status = status;
    if (itemType) where.itemType = itemType;

    if (search) {
      where.OR = [
        { reason: { contains: search, mode: "insensitive" } },
        { details: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { user: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.report.count({ where }),
    ]);

    const reportsWithItems = await Promise.all(
      reports.map(async (report: { itemType: any; itemId: any }) => {
        let itemDetails = null;

        switch (report.itemType) {
          case "MARKETPLACE":
            itemDetails = await prisma.marketplace.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
          case "REAL_ESTATE":
            itemDetails = await prisma.realEstate.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
          case "CAR":
            itemDetails = await prisma.car.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
          case "BOAT":
            itemDetails = await prisma.boat.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
          case "MOTORCYCLE":
            itemDetails = await prisma.motorcycle.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
          case "TRAKTOR":
            itemDetails = await prisma.farmequipment.findUnique({
              where: { id: report.itemId },
              select: { id: true, title: true, price: true, images: true },
            });
            break;
        }

        return { ...report, item: itemDetails };
      }),
    );

    res.status(200).json({
      success: true,
      data: {
        reports: reportsWithItems,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;

    const report = await prisma.report.findUnique({
      where: { id: idValue },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }

    let itemDetails = null;
    switch (report.itemType) {
      case "MARKETPLACE":
        itemDetails = await prisma.marketplace.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
      case "REAL_ESTATE":
        itemDetails = await prisma.realEstate.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
      case "CAR":
        itemDetails = await prisma.car.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
      case "BOAT":
        itemDetails = await prisma.boat.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
      case "MOTORCYCLE":
        itemDetails = await prisma.motorcycle.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
      case "TRAKTOR":
        itemDetails = await prisma.farmequipment.findUnique({
          where: { id: report.itemId },
          include: {
            user: {
              select: { id: true, username: true, email: true },
            },
          },
        });
        break;
    }

    res.status(200).json({
      success: true,
      data: { ...report, item: itemDetails },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;
    const { status, resolution } = req.body;
    const reviewedBy = (req as any).user?.id;

    if (!reviewedBy) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const report = await prisma.report.update({
      where: { id: idValue },
      data: {
        status,
        resolution,
        reviewedBy,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, data: report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.$transaction([
      prisma.report.count(),
      prisma.report.count({ where: { status: "NEW" } }),
      prisma.report.count({ where: { status: "IN_PROGRESS" } }),
      prisma.report.count({ where: { status: "DONE" } }),
      prisma.report.count({ where: { status: "RESOLVED" } }),
      prisma.report.count({ where: { status: "CLOSED" } }),
      prisma.report.groupBy({
        by: ["itemType"],
        _count: true,
        orderBy: { _count: { itemType: "desc" } },
      }),
      prisma.report.groupBy({
        by: ["reason"],
        _count: true,
        orderBy: { _count: { reason: "desc" } },
        take: 5,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0],
        new: stats[1],
        inProgress: stats[2],
        done: stats[3],
        resolved: stats[4],
        closed: stats[5],
        byItemType: stats[6],
        topReasons: stats[7],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTotalReports = async (req: Request, res: Response) => {
  try {
    const total = await prisma.report.count();
    res.status(200).json({ success: true, data: total });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserReports = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userIdValue = Array.isArray(userId) ? userId[0] : userId;
    const page = (req.query.page as string) || "1";
    const limit = (req.query.limit as string) || "10";

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where: { reporterId: userIdValue },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.report.count({ where: { reporterId: userIdValue } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idValue = Array.isArray(id) ? id[0] : id;

    await prisma.report.delete({
      where: { id: idValue },
    });

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
