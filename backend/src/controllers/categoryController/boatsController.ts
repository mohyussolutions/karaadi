import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { prisma } from "../../core/utils/db.ts";

export const getTotalBoats = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.boat.count({});
    return res.json({ totalBoats: total });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllBoatsIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const boats = await prisma.boat.findMany({
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
    });
    res.json(boats);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateBoat = async (req: Request, res: Response) => {
  try {
    const updatedBoat = await prisma.boat.update({
      where: { id: req.params.id },
      data: req.body,
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
    });
    return res.json(updatedBoat);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Boat not found" });
    return res.status(400).json({ message: "Update failed", error });
  }
};

export const getAllBoats = async (req: Request, res: Response) => {
  try {
    const { type, listingType, region, city, district, subCategory, category } =
      req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (listingType) filter.listingType = listingType;
    if (region) filter.region = region;
    if (city) filter.city = city;
    if (district) filter.district = district;
    if (subCategory) filter.subCategory = subCategory;
    if (category) filter.category = category;

    const boats = await prisma.boat.findMany({
      where: { isPaid: true },
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
    });

    return res.json(boats);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getBoatById = async (req: Request, res: Response) => {
  try {
    const boat = await prisma.boat.findUnique({
      where: { id: req.params.id },
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
    });

    if (!boat) return res.status(404).json({ message: "Boat not found" });
    return res.json(boat);
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const createBoat = async (req: Request, res: Response) => {
  try {
    const { userId, ...boatData } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const data = {
      ...boatData,
      userId,
      category: Array.isArray(boatData.category)
        ? boatData.category
        : [boatData.category].filter(Boolean),
      subcategory: Array.isArray(boatData.subcategory)
        ? boatData.subcategory
        : [boatData.subcategory].filter(Boolean),
      images: Array.isArray(boatData.images) ? boatData.images : [],
      price: Number(boatData.price) || 0,
      type: boatData.type || "boat",
      boatModel: boatData.boatModel || "",
      transmission: boatData.transmission || "",
      color: boatData.color || "",
      listingType: boatData.listingType || "",
      isPaid: false,
      maGaday: false,
    };

    const newBoat = await prisma.boat.create({
      data,
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
    });

    await triggerSubscriptionWatch("boat", newBoat.id);

    return res.status(201).json(newBoat);
  } catch (error: any) {
    return res
      .status(400)
      .json({ message: "Invalid data", error: error.message });
  }
};
export const deleteBoat = async (req: Request, res: Response) => {
  try {
    await prisma.boat.delete({ where: { id: req.params.id } });

    return res.json({ message: "Boat deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};
