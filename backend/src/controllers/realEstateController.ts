import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { Prisma } from "@prisma/client";

import { getPageAndSkip } from "src/hooks/usePagination.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import { getBusinessListingFlags } from "src/core/utils/businessListingFlags.ts";
import cacheManager from "src/services/redis/cacheManager.ts";

const PLAN_TYPES = {
  BASIC: "basic30",
  STANDARD: "standard60",
  PREMIUM: "premium90",
} as const;

const SORT_DIRECTION = {
  DESC: "desc",
  ASC: "asc",
} as const;

const PAYMENT_STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;

const LISTING_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  PENDING: "pending",
} as const;

const FIELD_NAMES = {
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  PLAN_AMOUNT: "planAmount",
  PLAN_ID: "planId",
  IS_PAID: "isPaid",
  EXPIRY_DATE: "expiryDate",
  TITLE: "title",
  DESCRIPTION: "description",
  CREATED_AT: "createdAt",
  USER_ID: "userId",
  PRICE: "price",
  MAIN_CATEGORY: "mainCategory",
  REGION: "region",
  CITY: "city",
  COUNTY: "county",
  IMAGES: "images",
  BEDROOMS: "bedrooms",
  BATHROOMS: "bathrooms",
  SQUARE_FEET: "squareFeet",
  ADDRESS: "address",
  HAS_GARAGE: "hasGarage",
  HAS_GARDEN: "hasGarden",
} as const;

const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  PROPERTY_NOT_FOUND: "Property not found",
  MISSING_FIELDS: "Missing required fields",
  CREATION_FAILED: "Creation failed",
  UPDATE_FAILED: "Update failed",
  ITEM_NOT_FOUND: "Item not found",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Property deleted successfully",
} as const;

const selectUserBasic = {
  select: {
    id: true,
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

const formatItem = (item: any) => ({
  ...item,
  isExpired: isExpired(item.expiryDate),
  status: isExpired(item.expiryDate)
    ? LISTING_STATUS.EXPIRED
    : item.isPaid
      ? LISTING_STATUS.ACTIVE
      : LISTING_STATUS.PENDING,
  daysUntilExpiry: getDaysUntilExpiry(item.expiryDate),
  formattedExpiry: formatExpiryDate(item.expiryDate),
});

export const getAllRealEstates = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const cacheKey = CACHE_KEYS.ALL_PAID(pageNum, sizeNum);
    const properties = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.realEstate.findMany({
          where: {
            isPaid: true,
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
          orderBy: [
            { isPremium90: SORT_DIRECTION.DESC },
            { isStandard60: SORT_DIRECTION.DESC },
            { isBasic30: SORT_DIRECTION.DESC },
            { maGaday: SORT_DIRECTION.DESC },
            { createdAt: SORT_DIRECTION.DESC },
          ],
          skip,
          take: sizeNum,
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            mainCategory: true,
            category: true,
            region: true,
            city: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            isBasic30: true,
            isStandard60: true,
            isPremium90: true,
            maGaday: true,
            user: selectUserMinimal,
          },
        });
      },
      CACHE_TTL.LIST,
    );

    return res.json(properties.map(formatItem));
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: (error as Error).message,
    });
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
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            mainCategory: true,
            category: true,
            region: true,
            city: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            isBasic30: true,
            isStandard60: true,
            isPremium90: true,
            maGaday: true,
            user: selectUserBasic,
            fee: true,
            plan: true,
          },
          orderBy: { createdAt: SORT_DIRECTION.DESC },
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(properties);
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: (error as Error).message,
    });
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
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: (error as Error).message,
    });
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
          select: {
            id: true,
            userId: true,
            title: true,
            description: true,
            price: true,
            mainCategory: true,
            category: true,
            subcategory: true,
            propertyType: true,
            bedrooms: true,
            bathrooms: true,
            floor: true,
            totalFloors: true,
            squareFeet: true,
            sizeSqm: true,
            furnished: true,
            parking: true,
            amenities: true,
            address: true,
            hasGarage: true,
            hasGarden: true,
            region: true,
            city: true,
            county: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            isBasic30: true,
            isStandard60: true,
            isPremium90: true,
            maGaday: true,
            user: selectUserBasic,
            fee: true,
            plan: true,
          },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!property) {
      const fallback = await prisma.realEstate.findFirst({
        where: {
          OR: [
            { id },
            { title: { contains: id, mode: "insensitive" } },
            { description: { contains: id, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          userId: true,
          title: true,
          description: true,
          price: true,
          mainCategory: true,
          category: true,
          subcategory: true,
          propertyType: true,
          bedrooms: true,
          bathrooms: true,
          floor: true,
          totalFloors: true,
          squareFeet: true,
          sizeSqm: true,
          furnished: true,
          parking: true,
          amenities: true,
          address: true,
          hasGarage: true,
          hasGarden: true,
          region: true,
          city: true,
          county: true,
          images: true,
          createdAt: true,
          expiryDate: true,
          isPaid: true,
          isBasic30: true,
          isStandard60: true,
          isPremium90: true,
          maGaday: true,
          user: selectUserBasic,
          fee: true,
          plan: true,
        },
      });
      if (!fallback)
        return res
          .status(404)
          .json({ message: ERROR_MESSAGES.PROPERTY_NOT_FOUND, id });
      return res.json({ ...formatItem(fallback), foundByFallback: true });
    }
    return res.json(formatItem(property));
  } catch (error) {
    return res.status(500).json({
      message: ERROR_MESSAGES.SERVER_ERROR,
      error: (error as Error).message,
    });
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
      businessId,
    } = req.body;

    const finalUserId = (req as any).user?.id || userId;
    if (!title || price === undefined || price === null || price === "" || !mainCategory || !region || !city || !finalUserId) {
      return res.status(400).json({ message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    let expiryDate = null;
    let finalPlanAmount = 0;

    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      if (plan) {
        expiryDate = calculateExpiryDate(plan, planAmount);
        finalPlanAmount = planAmount;
      }
    }

    const biz = await getBusinessListingFlags(businessId || null);
    if (biz.isPaidByBusiness) expiryDate = expiryDate ?? biz.expiryDate;

    const newProperty = await prisma.realEstate.create({
      data: {
        title,
        description: description || "",
        price: Number(price),
        mainCategory,
        businessId: businessId || null,
        [FIELD_NAMES.CATEGORY]: Array.isArray(category)
          ? category
          : [category].filter(Boolean),
        [FIELD_NAMES.SUBCATEGORY]: Array.isArray(subcategory)
          ? subcategory
          : [subcategory].filter(Boolean),
        bedrooms: bedrooms ? Number(bedrooms) : 1,
        bathrooms: bathrooms ? Number(bathrooms) : 1,
        [FIELD_NAMES.IS_PAID]: biz.isPaidByBusiness,
        maGaday: false,
        isBasic30: biz.isBasic30,
        isStandard60: biz.isStandard60,
        isPremium90: biz.isPremium90,
        squareFeet: squareFeet ? Number(squareFeet) : null,
        address: address || "",
        hasGarage: hasGarage !== undefined ? Boolean(hasGarage) : false,
        hasGarden: hasGarden !== undefined ? Boolean(hasGarden) : false,
        region,
        city,
        county: county || region,
        [FIELD_NAMES.IMAGES]: Array.isArray(images) ? images : [],
        [FIELD_NAMES.USER_ID]: finalUserId,
        [FIELD_NAMES.PLAN_ID]: planId || null,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
      },
      select: { id: true, title: true, user: selectUserBasic },
    });

    res.status(201).json(newProperty);
    cacheManager.deletePattern("realestate:*").catch(() => {});
    cacheManager.deletePattern(`businesses:my:${finalUserId}*`).catch(() => {});
    notifyMatchingSubscribers("realestate", newProperty.id, {
      title,
      price: Number(price) ?? 0,
      mainCategory: mainCategory ?? "RealEstate",
      subCategory: Array.isArray(subcategory) ? subcategory[0] : subcategory,
      region,
      city,
      posterId: userId,
    }).catch(() => {});
  } catch (error) {
    return res.status(400).json({
      message: ERROR_MESSAGES.CREATION_FAILED,
      error: (error as Error).message,
    });
  }
};

export const updateRealEstatePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId, planType, planAmount } = req.body;

    const item = await prisma.realEstate.findUnique({
      where: { id },
      select: { id: true, planAmount: true, planId: true },
    });

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: ERROR_MESSAGES.ITEM_NOT_FOUND });

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });

    const amountToUse = planAmount || item.planAmount;
    const expiryDate =
      planId && subPlan && amountToUse
        ? calculateExpiryDate(subPlan, amountToUse)
        : null;

    const priorityFlags = {
      isBasic30: planType === PLAN_TYPES.BASIC,
      isStandard60: planType === PLAN_TYPES.STANDARD,
      isPremium90: planType === PLAN_TYPES.PREMIUM,
    };

    const updatedItem = await prisma.realEstate.update({
      where: { id },
      data: {
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
        [FIELD_NAMES.PLAN_ID]: planId || item.planId,
        [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        ...priorityFlags,
      },
      select: { id: true, isPaid: true, expiryDate: true },
    });

    if (paymentId)
      await prisma.payment.updateMany({
        where: { id: paymentId },
        data: {
          realEstateId: id,
          status: PAYMENT_STATUS.COMPLETED,
          paidAt: new Date(),
          [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        },
      });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("realestate:*"),
    ]);

    return res.json({ success: true, data: updatedItem });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: (error as Error).message });
  }
};

export const updateRealEstate = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updateData: Record<string, any> = {};

    for (const key in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (key === FIELD_NAMES.CATEGORY && req.body[key] !== undefined) {
          updateData[FIELD_NAMES.CATEGORY] = Array.isArray(req.body[key])
            ? req.body[key]
            : [req.body[key]];
        } else if (
          key === FIELD_NAMES.SUBCATEGORY &&
          req.body[key] !== undefined
        ) {
          updateData[FIELD_NAMES.SUBCATEGORY] = Array.isArray(req.body[key])
            ? req.body[key]
            : [req.body[key]];
        } else if (
          key === FIELD_NAMES.PLAN_AMOUNT &&
          req.body[key] !== undefined
        ) {
          updateData[FIELD_NAMES.PLAN_AMOUNT] = req.body[key];
        } else if (key === FIELD_NAMES.PLAN_ID && req.body[key] !== undefined) {
          updateData[FIELD_NAMES.PLAN_ID] = req.body[key];
        } else if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }
    }

    if (
      updateData[FIELD_NAMES.PLAN_ID] &&
      updateData[FIELD_NAMES.PLAN_AMOUNT]
    ) {
      const plan = await prisma.subPlan.findUnique({
        where: { id: updateData[FIELD_NAMES.PLAN_ID] },
      });
      if (plan) {
        updateData[FIELD_NAMES.EXPIRY_DATE] = calculateExpiryDate(
          plan,
          updateData[FIELD_NAMES.PLAN_AMOUNT],
        );
      }
    }

    const updatedItem = await prisma.realEstate.update({
      where: { id },
      data: updateData,
      select: { id: true, isPaid: true, title: true },
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("realestate:*"),
    ]);

    return res.json(updatedItem);
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.PROPERTY_NOT_FOUND });
    return res
      .status(400)
      .json({ message: ERROR_MESSAGES.UPDATE_FAILED, error: err.message });
  }
};

export const deleteRealEstate = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.realEstate.delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("realestate:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ message: SUCCESS_MESSAGES.DELETED });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025")
      return res
        .status(404)
        .json({ message: ERROR_MESSAGES.PROPERTY_NOT_FOUND });
    return res
      .status(500)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR, error: err.message });
  }
};
