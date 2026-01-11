import prisma from "core/utils/db.ts";
import { Request, Response } from "express";
// Import the trigger function from your subscription controller
import { triggerSubscriptionWatch } from "controllers/userController/subscriptionController.ts";

export const getAllMarketplaceItemsAdmin = async (
  _req: Request,
  res: Response
) => {
  try {
    const items = await prisma.marketplace.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(items);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getTotalMarketplaceItems = async (
  _req: Request,
  res: Response
) => {
  try {
    const total = await prisma.marketplace.count({});
    return res.json({ totalMarketplaceItems: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getPaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response
) => {
  try {
    const total = await prisma.marketplace.count({
      where: { isPaid: true },
    });
    return res.json({ paidTotalMarketplaceItems: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getUnpaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response
) => {
  try {
    const total = await prisma.marketplace.count({
      where: { isPaid: false },
    });
    return res.json({ unpaidTotalMarketplaceItems: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.marketplace.findMany({
      where: { isPaid: true },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getMarketplaceItemById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const item = await prisma.marketplace.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const { listingType, ...marketplaceData } = req.body;

    const newItem = await prisma.marketplace.create({
      data: {
        ...marketplaceData,
        isPaid: false,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    await triggerSubscriptionWatch("marketplace", newItem.id);

    return res.status(201).json(newItem);
  } catch (error: any) {
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid User ID",
        error: "The provided userId does not exist.",
      });
    }

    return res.status(400).json({
      message: "Invalid data",
      error: error.message,
    });
  }
};

export const updateMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const updatedItem = await prisma.marketplace.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.json(updatedItem);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Item not found" });

    return res.status(400).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

export const deleteMarketplaceItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    await prisma.marketplace.delete({ where: { id } });
    return res.json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "Item not found", error });
  }
};
