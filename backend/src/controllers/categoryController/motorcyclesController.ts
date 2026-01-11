import { triggerSubscriptionWatch } from "controllers/userController/subscriptionController.ts";
import prisma from "core/utils/db.ts";
import { Request, Response } from "express";

export const getAllMotorcyclesIncludingUnpaid = async (
  _req: Request,
  res: Response
) => {
  try {
    const items = await prisma.motorcycle.findMany({
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
    return res.json(items);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getTotalMotorcycles = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.motorcycle.count();
    return res.json({ totalMotorcycles: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllMotorcycles = async (req: Request, res: Response) => {
  try {
    const motorcycles = await prisma.motorcycle.findMany({
      where: { isPaid: true },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    return res.json(motorcycles);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getMotorcycleById = async (req: Request, res: Response) => {
  try {
    const motorcycle = await prisma.motorcycle.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    if (!motorcycle)
      return res.status(404).json({ message: "Motorcycle not found" });
    return res.json(motorcycle);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
export const createMotorcycle = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      category: Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category].filter(Boolean),
      subcategory: Array.isArray(req.body.subcategory)
        ? req.body.subcategory
        : [req.body.subcategory].filter(Boolean),
      images: Array.isArray(req.body.images) ? req.body.images : [],
    };

    const newMotorcycle = await prisma.motorcycle.create({
      data,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await triggerSubscriptionWatch("motorcycle", newMotorcycle.id);

    return res.status(201).json(newMotorcycle);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Invalid data", error: error.message });
  }
};

export const updateMotorcycle = async (req: Request, res: Response) => {
  try {
    const updatedMotorcycle = await prisma.motorcycle.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    return res.json(updatedMotorcycle);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Motorcycle not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteMotorcycle = async (req: Request, res: Response) => {
  try {
    await prisma.motorcycle.delete({ where: { id: req.params.id } });
    return res.json({ message: "Motorcycle deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Motorcycle not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
