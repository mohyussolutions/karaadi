import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { User, Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

export const getAllTractorsIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const tractors = await cacheManager.withCache(
      "tractors:admin:all",
      async () => {
        return await prisma.traktor.findMany({
          include: {
            user: {
              select: {
                username: true,
                email: true,
                phone: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      },
    );
    return res.json(tractors);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to fetch tractors", error: err.message });
  }
};

export const getTotalTractors = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      "tractors:total",
      async () => {
        return await prisma.traktor.count();
      },
      600,
    );
    return res.json({ totalTractors: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to get total tractors", error: err.message });
  }
};

export const getAllTractors = async (_req: Request, res: Response) => {
  try {
    const tractors = await cacheManager.withCache(
      "tractors:public:all",
      async () => {
        return await prisma.traktor.findMany({
          where: { isPaid: true },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );
    return res.json(tractors);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to fetch tractors", error: err.message });
  }
};

export const getTractorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    const tractor = await cacheManager.withCache(
      `tractor:detail:${id}`,
      async () => {
        return await prisma.traktor.findUnique({
          where: { id },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );

    if (!tractor) return res.status(404).json({ message: "Tractor not found" });
    return res.json(tractor);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Failed to fetch tractor", error: err.message });
  }
};

export const createTractor = async (req: AuthRequest, res: Response) => {
  try {
    let userId =
      req.body.userId || req.user?.id || req.user?._id || req.user?.sub;

    if (!userId)
      return res.status(401).json({ message: "User authentication required" });

    const data = {
      ...req.body,
      userId,
      category: req.body.category || ["Agriculture"],
      subcategory: req.body.subcategory || [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      attachments: Array.isArray(req.body.attachments)
        ? req.body.attachments
        : [],
    };

    const newTractor = await prisma.traktor.create({
      data,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete("tractors:total"),
    ]);

    await triggerSubscriptionWatch("traktor", newTractor.id);

    return res.status(201).json(newTractor);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Failed to create tractor", error: err.message });
  }
};

export const updateTractor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    const updatedTractor = await prisma.traktor.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.delete(`tractor:detail:${id}`),
      cacheManager.deletePattern("tractors:*:all"),
    ]);

    return res.json(updatedTractor);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Tractor not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteTractor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    await prisma.traktor.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`tractor:detail:${id}`),
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete("tractors:total"),
    ]);

    return res.json({ message: "Tractor deleted successfully" });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Tractor not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete tractor", error: err.message });
  }
};
