import { triggerSubscriptionWatch } from "controllers/userController/subscriptionController.ts";
import prisma from "core/utils/db.ts";
import { Request, Response } from "express";
export const getAllTractorsIncludingUnpaid = async (
  req: Request,
  res: Response
) => {
  try {
    const tractors = await prisma.traktor.findMany({
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
    return res.json(tractors);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Failed to fetch tractors", error: error.message });
  }
};

export const getTotalTractors = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.traktor.count();
    return res.json({ totalTractors: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Failed to get total tractors", error: error.message });
  }
};

export const getAllTractors = async (req: Request, res: Response) => {
  try {
    const tractors = await prisma.traktor.findMany({
      where: { isPaid: true },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    return res.json(tractors);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Failed to fetch tractors", error: error.message });
  }
};

export const getTractorById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    const tractor = await prisma.traktor.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    if (!tractor) return res.status(404).json({ message: "Tractor not found" });

    return res.json(tractor);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Failed to fetch tractor", error: error.message });
  }
};

export const createTractor = async (req: Request, res: Response) => {
  try {
    let userId = req.body.userId;
    if (!userId) {
      const user = (req as any).user;
      if (user?.id) userId = user.id;
    }
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

    await triggerSubscriptionWatch("traktor", newTractor.id);

    return res.status(201).json(newTractor);
  } catch (error: any) {
    console.error("Create Tractor Error:", error);
    return res
      .status(400)
      .json({ message: "Failed to create tractor", error: error.message });
  }
};

export const updateTractor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    const updatedTractor = await prisma.traktor.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    return res.json(updatedTractor);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Tractor not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteTractor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({ message: "Invalid or missing tractor ID" });

    await prisma.traktor.delete({ where: { id } });
    return res.json({ message: "Tractor deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Tractor not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete tractor", error: error.message });
  }
};
