import { triggerSubscriptionWatch } from "controllers/userController/subscriptionController.ts";
import prisma from "core/utils/db.ts";
import { Request, Response } from "express";
export const getAllRealEstates = async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.realEstate.findMany({
      where: { isPaid: true },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(properties);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getAllRealEstatesIncludingUnpaid = async (
  _req: Request,
  res: Response
) => {
  try {
    const properties = await prisma.realEstate.findMany({
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(properties);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getTotalRealEstates = async (_req: Request, res: Response) => {
  try {
    const total = await prisma.realEstate.count();
    return res.json({ totalRealEstates: total });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const getRealEstateById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const property = await prisma.realEstate.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    return res.json(property);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
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
      district,
      subDistrict,
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
      return res.status(400).json({
        message:
          "Missing required fields: title, price, mainCategory, region, city, county, userId",
      });
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
        district: district || "",
        subDistrict: subDistrict || "",
        images: Array.isArray(images) ? images : [],
        userId,
      },
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });

    await triggerSubscriptionWatch("realestate", newProperty.id);

    return res.status(201).json(newProperty);
  } catch (error: any) {
    console.error("Create Real Estate Error:", error);
    return res.status(400).json({
      message: "Creation failed",
      error: error.message,
    });
  }
};
export const updateRealEstate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const updatedProperty = await prisma.realEstate.update({
      where: { id },
      data: req.body,
      include: {
        user: { select: { username: true, email: true, phone: true } },
      },
    });
    return res.json(updatedProperty);
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Property not found" });
    return res
      .status(400)
      .json({ message: "Update failed", error: error.message });
  }
};

export const deleteRealEstate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await prisma.realEstate.delete({ where: { id } });
    return res.json({ message: "Property deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "Property not found" });
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
