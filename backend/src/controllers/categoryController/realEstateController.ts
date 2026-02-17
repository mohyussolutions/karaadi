import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { triggerSubscriptionWatch } from "../userController/subscriptionController.ts";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";

export const getAllRealEstates = async (_req: Request, res: Response) => {
  try {
    const properties = await cacheManager.withCache(
      "realestate:public:all",
      async () => {
        return await prisma.realEstate.findMany({
          where: { isPaid: true },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
          orderBy: { createdAt: "desc" },
        });
      },
    );
    return res.json(properties);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getAllRealEstatesIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const properties = await cacheManager.withCache(
      "realestate:admin:all",
      async () => {
        return await prisma.realEstate.findMany({
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
          orderBy: { createdAt: "desc" },
        });
      },
    );
    return res.json(properties);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getTotalRealEstates = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      "realestate:total",
      async () => {
        return await prisma.realEstate.count();
      },
      600,
    );
    return res.json({ totalRealEstates: total });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const getRealEstateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await cacheManager.withCache(
      `realestate:detail:${id}`,
      async () => {
        return await prisma.realEstate.findUnique({
          where: { id },
          include: {
            user: { select: { username: true, email: true, phone: true } },
          },
        });
      },
    );

    if (!property)
      return res.status(404).json({ message: "Property not found" });
    return res.json(property);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};

export const createRealEstate = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      price,
      mainCategory,
      category,
      subcategory,
      bedrooms,
      bathrooms,
      isPaid,
      squareFeet,
      address,
      hasGarage,
      hasGarden,
      region,
      city,
      county,
      images,
      userId,
    } = req.body;

    if (
      !title ||
      !price ||
      !mainCategory ||
      !region ||
      !city ||
      !county ||
      !userId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProperty = await prisma.realEstate.create({
      data: {
        title,
        description: description || "",
        price: Number(price),
        mainCategory,
        category: Array.isArray(category)
          ? category
          : [category].filter(Boolean),
        subcategory: Array.isArray(subcategory)
          ? subcategory
          : [subcategory].filter(Boolean),
        bedrooms: bedrooms ? Number(bedrooms) : 1,
        bathrooms: bathrooms ? Number(bathrooms) : 1,
        isPaid: isPaid !== undefined ? Boolean(isPaid) : true,
        squareFeet: squareFeet ? Number(squareFeet) : null,
        address: address || "",
        hasGarage: hasGarage !== undefined ? Boolean(hasGarage) : false,
        hasGarden: hasGarden !== undefined ? Boolean(hasGarden) : false,
        region,
        city,
        county: county || region,
        images: Array.isArray(images) ? images : [],
        userId,
      },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.deletePattern("realestate:*:all"),
      cacheManager.delete("realestate:total"),
    ]);

    await triggerSubscriptionWatch("realestate", newProperty.id);

    return res.status(201).json(newProperty);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Creation failed", error: err.message });
  }
};

export const updateRealEstate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProperty = await prisma.realEstate.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await Promise.all([
      cacheManager.delete(`realestate:detail:${id}`),
      cacheManager.deletePattern("realestate:*:all"),
    ]);

    return res.json(updatedProperty);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Property not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: err.message });
  }
};

export const deleteRealEstate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.realEstate.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(`realestate:detail:${id}`),
      cacheManager.deletePattern("realestate:*:all"),
      cacheManager.delete("realestate:total"),
    ]);

    return res.json({ message: "Property deleted successfully" });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res.status(404).json({ message: "Property not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
};
