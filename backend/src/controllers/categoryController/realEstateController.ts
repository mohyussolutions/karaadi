import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
import { Prisma } from "@prisma/client";
import {
  CACHE_TTL,
  getPaginationParams,
} from "src/constants/config.constants.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";

const selectUserBasic = {
  select: {
    username: true,
    email: true,
    phone: true,
    profileImage: true,
  },
};

const selectUserMinimal = {
  select: { username: true },
};

const CACHE_KEYS = {
  ALL_ADMIN: "realestate:admin:all",
  TOTAL: "realestate:total",
  ALL_PAID: (page: number, limit: number) =>
    `realestate:paid:page:${page}:limit:${limit}`,
  DETAIL: (id: string) => `realestate:detail:${id}`,
};

export const getAllRealEstates = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPaginationParams(
      req.query.page as string,
      req.query.pageSize as string,
    );

    const cacheKey = CACHE_KEYS.ALL_PAID(page, limit);
    const properties = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.realEstate.findMany({
          where: {
            isPaid: true,
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          select: {
            id: true,
            title: true,
            price: true,
            mainCategory: true,
            category: true,
            region: true,
            city: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            user: selectUserMinimal,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        });
      },
      CACHE_TTL.LIST,
    );

    const propertiesWithStatus = properties.map((item) => ({
      ...item,
      isExpired: isExpired(item.expiryDate),
      status: isExpired(item.expiryDate)
        ? "expired"
        : item.isPaid
          ? "active"
          : "pending",
    }));

    return res.json(propertiesWithStatus);
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
      CACHE_KEYS.ALL_ADMIN,
      async () => {
        return await prisma.realEstate.findMany({
          include: { user: selectUserBasic },
          orderBy: { createdAt: "desc" },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
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
      CACHE_KEYS.TOTAL,
      async () => await prisma.realEstate.count(),
      CACHE_TTL.STATS,
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const property = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.realEstate.findUnique({
          where: { id },
          include: { user: selectUserBasic },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    const expired = isExpired(property.expiryDate);
    return res.json({
      ...property,
      isExpired: expired,
      status: expired ? "expired" : property.isPaid ? "active" : "pending",
      daysUntilExpiry: getDaysUntilExpiry(property.expiryDate),
      formattedExpiry: formatExpiryDate(property.expiryDate),
    });
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
      squareFeet,
      address,
      hasGarage,
      hasGarden,
      region,
      city,
      county,
      images,
      userId,
      planId,
      planAmount,
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

    let expiryDate = null;
    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      expiryDate = plan ? calculateExpiryDate(plan, planAmount) : null;
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
        isPaid: false,
        maGaday: false,
        squareFeet: squareFeet ? Number(squareFeet) : null,
        address: address || "",
        hasGarage: hasGarage !== undefined ? Boolean(hasGarage) : false,
        hasGarden: hasGarden !== undefined ? Boolean(hasGarden) : false,
        region,
        city,
        county: county || region,
        images: Array.isArray(images) ? images : [],
        userId,
        planId: planId || null,
        planAmount: planAmount || 0,
        expiryDate,
      },
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.deletePattern("realestate:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.status(201).json(newProperty);
  } catch (error) {
    const err = error as Error;
    return res
      .status(400)
      .json({ message: "Creation failed", error: err.message });
  }
};

export const updateRealEstatePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId } = req.body;

    const property = await prisma.realEstate.findUnique({ where: { id } });
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });
    const expiryDate =
      planId && subPlan && property.planAmount
        ? calculateExpiryDate(subPlan, property.planAmount)
        : null;

    const updatedProperty = await prisma.realEstate.update({
      where: { id },
      data: {
        isPaid: true,
        expiryDate,
        planId: planId || property.planId,
      },
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: { realEstateId: id, status: "COMPLETED", paidAt: new Date() },
      });
    }

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("realestate:*:all"),
    ]);

    return res.json({ success: true, data: updatedProperty });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateRealEstate = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { planId, planAmount, category, subcategory, ...updateData } =
      req.body;

    const processedData: any = { ...updateData };

    if (category) {
      processedData.category = Array.isArray(category) ? category[0] : category;
    }
    if (subcategory) {
      processedData.subcategory = Array.isArray(subcategory)
        ? subcategory[0]
        : subcategory;
    }

    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      processedData.expiryDate = plan
        ? calculateExpiryDate(plan, planAmount)
        : null;
      processedData.planId = planId;
      processedData.planAmount = planAmount;
    }

    const updatedProperty = await prisma.realEstate.update({
      where: { id },
      data: processedData,
      include: { user: selectUserBasic },
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
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
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.realEstate.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("realestate:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
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
