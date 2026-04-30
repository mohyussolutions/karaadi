import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { Prisma } from "@prisma/client";
import { CACHE_TTL } from "src/config/config.constants.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import { getPageAndSkip } from "src/hooks/usePagination.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
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
  ID: "id",
  TITLE: "title",
  PRICE: "price",
  DESCRIPTION: "description",
  MAIN_CATEGORY: "mainCategory",
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  REGION: "region",
  CITY: "city",
  IMAGES: "images",
  CREATED_AT: "createdAt",
  EXPIRY_DATE: "expiryDate",
  IS_PAID: "isPaid",
  IS_BASIC_30: "isBasic30",
  IS_STANDARD_60: "isStandard60",
  IS_PREMIUM_90: "isPremium90",
  MA_GADAY: "maGaday",
  USER: "user",
  FEE: "fee",
  PLAN: "plan",
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  PROFILE_IMAGE: "profileImage",
  TYPE: "type",
  MAKE: "make",
  MODEL_NAME: "modelName",
  YEAR: "year",
  MILEAGE: "mileage",
  ENGINE_SIZE: "engineSize",
  FUEL_TYPE: "fuelType",
  COLOR: "color",
  TRANSMISSION: "transmission",
  USER_ID: "userId",
  SO: "so",
  PLAN_ID: "planId",
  PLAN_AMOUNT: "planAmount",
  MOTORCYCLE_ID: "motorcycleId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  FOUND_BY_FALLBACK: "foundByFallback",
} as const;

const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  NOT_FOUND: "Motorcycle not found",
  ITEM_NOT_FOUND: "Item not found",
  USER_ID_REQUIRED: "userId is required",
  CREATE_FAILED: "Failed to create",
  UPDATE_FAILED: "Update failed",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Motorcycle deleted successfully",
} as const;

const DEFAULT_VALUES = {
  MAIN_CATEGORY: "Motorcycles",
  TYPE: "Other",
  MAKE: "N/A",
  MODEL_NAME: "N/A",
  ENGINE_SIZE: "N/A",
  FUEL_TYPE: "Petrol",
  COLOR: "N/A",
  TRANSMISSION: "Manual",
} as const;

const selectUserBasic = {
  select: {
    [FIELD_NAMES.ID]: true,
    [FIELD_NAMES.USERNAME]: true,
    [FIELD_NAMES.EMAIL]: true,
    [FIELD_NAMES.PHONE]: true,
    [FIELD_NAMES.PROFILE_IMAGE]: true,
  },
};

const CACHE_KEYS = {
  TOTAL: "motorcycles:total",
  UNFILTERED: "motorcycles:all:unfiltered",
  ALL_PAID: (page: number, limit: number, type?: string, region?: string) =>
    `motorcycles:paid:${page}:${limit}:${type || "all"}:${region || "all"}`,
  DETAIL: (id: string) => `motorcycle:detail:${id}`,
};

const formatItem = (item: any) => ({
  ...item,
  isExpired: isExpired(item[FIELD_NAMES.EXPIRY_DATE]),
  [FIELD_NAMES.STATUS]: isExpired(item[FIELD_NAMES.EXPIRY_DATE])
    ? LISTING_STATUS.EXPIRED
    : item[FIELD_NAMES.IS_PAID]
      ? LISTING_STATUS.ACTIVE
      : LISTING_STATUS.PENDING,
  daysUntilExpiry: getDaysUntilExpiry(item[FIELD_NAMES.EXPIRY_DATE]),
  formattedExpiry: formatExpiryDate(item[FIELD_NAMES.EXPIRY_DATE]),
});

export const getTotalMotorcycles = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.motorcycle.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalMotorcycles: total });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getAllMotorcyclesIncludingUnpaid = async (
  _req: Request,
  res: Response,
) => {
  try {
    const motorcycles = await cacheManager.withCache(
      CACHE_KEYS.UNFILTERED,
      async () => {
        return await prisma.motorcycle.findMany({
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.MAIN_CATEGORY]: true,
            [FIELD_NAMES.CATEGORY]: true,
            [FIELD_NAMES.SUBCATEGORY]: true,
            [FIELD_NAMES.REGION]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.IS_BASIC_30]: true,
            [FIELD_NAMES.IS_STANDARD_60]: true,
            [FIELD_NAMES.IS_PREMIUM_90]: true,
            [FIELD_NAMES.MA_GADAY]: true,
            [FIELD_NAMES.USER]: selectUserBasic,
          },
          orderBy: { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
          take: 100,
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(motorcycles);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getAllMotorcycles = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const { type, region, city } = req.query;

    const cacheKey = CACHE_KEYS.ALL_PAID(
      pageNum,
      sizeNum,
      type as string,
      region as string,
    );

    const motorcycles = await cacheManager.withCache(
      cacheKey,
      async () => {
        const filter: Prisma.MotorcycleWhereInput = {
          [FIELD_NAMES.IS_PAID]: true,
          OR: [
            { [FIELD_NAMES.EXPIRY_DATE]: null },
            { [FIELD_NAMES.EXPIRY_DATE]: { gt: new Date() } },
          ],
        };
        if (type) filter.type = { contains: String(type), mode: "insensitive" };
        if (region) filter[FIELD_NAMES.REGION] = String(region);
        if (city) filter[FIELD_NAMES.CITY] = String(city);

        return await prisma.motorcycle.findMany({
          where: filter,
          orderBy: [
            { [FIELD_NAMES.IS_PREMIUM_90]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.IS_STANDARD_60]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.IS_BASIC_30]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.MA_GADAY]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
          ],
          skip,
          take: sizeNum,
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.MAIN_CATEGORY]: true,
            [FIELD_NAMES.CATEGORY]: true,
            [FIELD_NAMES.SUBCATEGORY]: true,
            [FIELD_NAMES.REGION]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.IS_BASIC_30]: true,
            [FIELD_NAMES.IS_STANDARD_60]: true,
            [FIELD_NAMES.IS_PREMIUM_90]: true,
            [FIELD_NAMES.MA_GADAY]: true,
            [FIELD_NAMES.USER]: selectUserBasic,
          },
        });
      },
      CACHE_TTL.LIST,
    );

    return res.json(motorcycles.map(formatItem));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getMotorcycleById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const motorcycle = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.motorcycle.findUnique({
          where: { [FIELD_NAMES.ID]: id },
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.MAIN_CATEGORY]: true,
            [FIELD_NAMES.CATEGORY]: true,
            [FIELD_NAMES.SUBCATEGORY]: true,
            [FIELD_NAMES.REGION]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.IS_BASIC_30]: true,
            [FIELD_NAMES.IS_STANDARD_60]: true,
            [FIELD_NAMES.IS_PREMIUM_90]: true,
            [FIELD_NAMES.MA_GADAY]: true,
            [FIELD_NAMES.TYPE]: true,
            [FIELD_NAMES.MAKE]: true,
            [FIELD_NAMES.MODEL_NAME]: true,
            [FIELD_NAMES.YEAR]: true,
            [FIELD_NAMES.MILEAGE]: true,
            [FIELD_NAMES.ENGINE_SIZE]: true,
            [FIELD_NAMES.FUEL_TYPE]: true,
            [FIELD_NAMES.COLOR]: true,
            [FIELD_NAMES.TRANSMISSION]: true,
            [FIELD_NAMES.USER]: selectUserBasic,
            [FIELD_NAMES.FEE]: true,
            [FIELD_NAMES.PLAN]: true,
          },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!motorcycle) {
      const fallback = await prisma.motorcycle.findFirst({
        where: {
          OR: [
            { [FIELD_NAMES.ID]: id },
            { [FIELD_NAMES.TITLE]: { contains: id, mode: "insensitive" } },
            {
              [FIELD_NAMES.DESCRIPTION]: { contains: id, mode: "insensitive" },
            },
          ],
        },
        select: {
          [FIELD_NAMES.ID]: true,
          [FIELD_NAMES.TITLE]: true,
          [FIELD_NAMES.PRICE]: true,
          [FIELD_NAMES.DESCRIPTION]: true,
          [FIELD_NAMES.MAIN_CATEGORY]: true,
          [FIELD_NAMES.CATEGORY]: true,
          [FIELD_NAMES.SUBCATEGORY]: true,
          [FIELD_NAMES.REGION]: true,
          [FIELD_NAMES.CITY]: true,
          [FIELD_NAMES.IMAGES]: true,
          [FIELD_NAMES.CREATED_AT]: true,
          [FIELD_NAMES.EXPIRY_DATE]: true,
          [FIELD_NAMES.IS_PAID]: true,
          [FIELD_NAMES.IS_BASIC_30]: true,
          [FIELD_NAMES.IS_STANDARD_60]: true,
          [FIELD_NAMES.IS_PREMIUM_90]: true,
          [FIELD_NAMES.MA_GADAY]: true,
          [FIELD_NAMES.USER]: selectUserBasic,
          [FIELD_NAMES.FEE]: true,
          [FIELD_NAMES.PLAN]: true,
        },
      });
      if (!fallback)
        return res.status(404).json({
          [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND,
          [FIELD_NAMES.ID]: id,
        });
      return res.json({
        ...formatItem(fallback),
        [FIELD_NAMES.FOUND_BY_FALLBACK]: true,
      });
    }
    return res.json(formatItem(motorcycle));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const createMotorcycle = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      description,
      price,
      mainCategory,
      category,
      subcategory,
      region,
      city,
      images,
      so,
      planId,
      planAmount,
      ...extra
    } = req.body;

    if (!userId)
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.USER_ID_REQUIRED });

    let expiryDate = null;
    let finalPlanAmount = 0;

    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({
        where: { [FIELD_NAMES.ID]: planId },
      });
      if (plan) {
        expiryDate = calculateExpiryDate(plan, planAmount);
        finalPlanAmount = planAmount;
      }
    }

    const newAd = await prisma.motorcycle.create({
      data: {
        [FIELD_NAMES.USER_ID]: userId,
        [FIELD_NAMES.TITLE]: title,
        [FIELD_NAMES.DESCRIPTION]: description,
        [FIELD_NAMES.PRICE]: parseFloat(price) || 0,
        [FIELD_NAMES.MAIN_CATEGORY]:
          mainCategory || DEFAULT_VALUES.MAIN_CATEGORY,
        [FIELD_NAMES.CATEGORY]: Array.isArray(category)
          ? category
          : [category].filter(Boolean),
        [FIELD_NAMES.SUBCATEGORY]: Array.isArray(subcategory)
          ? subcategory
          : [subcategory].filter(Boolean),
        [FIELD_NAMES.REGION]: region,
        [FIELD_NAMES.CITY]: city,
        [FIELD_NAMES.IMAGES]: Array.isArray(images) ? images : [],
        [FIELD_NAMES.IS_PAID]: false,
        [FIELD_NAMES.MA_GADAY]: false,
        [FIELD_NAMES.IS_BASIC_30]: false,
        [FIELD_NAMES.IS_STANDARD_60]: false,
        [FIELD_NAMES.IS_PREMIUM_90]: false,
        [FIELD_NAMES.PLAN_ID]: planId || null,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
        [FIELD_NAMES.TYPE]: extra.type || DEFAULT_VALUES.TYPE,
        [FIELD_NAMES.MAKE]: extra.make || extra.brand || DEFAULT_VALUES.MAKE,
        [FIELD_NAMES.MODEL_NAME]:
          extra.modelName || extra.model || DEFAULT_VALUES.MODEL_NAME,
        [FIELD_NAMES.YEAR]: parseInt(extra.year) || 0,
        [FIELD_NAMES.MILEAGE]: parseInt(extra.mileage) || 0,
        [FIELD_NAMES.ENGINE_SIZE]:
          extra.engineSize || extra.engineCc || DEFAULT_VALUES.ENGINE_SIZE,
        [FIELD_NAMES.FUEL_TYPE]: extra.fuelType || DEFAULT_VALUES.FUEL_TYPE,
        [FIELD_NAMES.COLOR]: extra.color || DEFAULT_VALUES.COLOR,
        [FIELD_NAMES.TRANSMISSION]:
          extra.transmission || extra.gearbox || DEFAULT_VALUES.TRANSMISSION,
      },
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.TITLE]: true,
        [FIELD_NAMES.USER]: selectUserBasic,
      },
    });

    await Promise.all([cacheManager.deletePattern("motorcycles:*")]);

    notifyMatchingSubscribers("motorcycle", newAd.id, {
      title,
      price: parseFloat(price) || 0,
      mainCategory: mainCategory ?? "Motorcycles",
      subCategory: Array.isArray(subcategory) ? subcategory[0] : subcategory,
      region,
      city,
      brand: extra.make,
      model: extra.modelName,
      posterId: userId,
    }).catch(console.error);

    return res.status(201).json(newAd);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.CREATE_FAILED,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const updateMotorcyclePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId, planType, planAmount } = req.body;

    const item = await prisma.motorcycle.findUnique({
      where: { [FIELD_NAMES.ID]: id },
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.PLAN_AMOUNT]: true,
        [FIELD_NAMES.PLAN_ID]: true,
      },
    });

    if (!item)
      return res.status(404).json({
        [FIELD_NAMES.SUCCESS]: false,
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.ITEM_NOT_FOUND,
      });

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });

    const amountToUse = planAmount || item[FIELD_NAMES.PLAN_AMOUNT];
    const expiryDate =
      planId && subPlan && amountToUse
        ? calculateExpiryDate(subPlan, amountToUse)
        : null;

    const priorityFlags = {
      [FIELD_NAMES.IS_BASIC_30]: planType === PLAN_TYPES.BASIC,
      [FIELD_NAMES.IS_STANDARD_60]: planType === PLAN_TYPES.STANDARD,
      [FIELD_NAMES.IS_PREMIUM_90]: planType === PLAN_TYPES.PREMIUM,
    };

    const updatedItem = await prisma.motorcycle.update({
      where: { [FIELD_NAMES.ID]: id },
      data: {
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
        [FIELD_NAMES.PLAN_ID]: planId || item[FIELD_NAMES.PLAN_ID],
        [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        ...priorityFlags,
      },
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.EXPIRY_DATE]: true,
      },
    });

    if (paymentId)
      await prisma.payment.updateMany({
        where: { [FIELD_NAMES.ID]: paymentId },
        data: {
          [FIELD_NAMES.MOTORCYCLE_ID]: id,
          [FIELD_NAMES.STATUS]: PAYMENT_STATUS.COMPLETED,
          [FIELD_NAMES.PAID_AT]: new Date(),
          [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        },
      });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:*"),
    ]);

    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.DATA]: updatedItem,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: err.message,
    });
  }
};

export const updateMotorcycle = async (req: Request, res: Response) => {
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
        where: { [FIELD_NAMES.ID]: updateData[FIELD_NAMES.PLAN_ID] },
      });
      if (plan) {
        updateData[FIELD_NAMES.EXPIRY_DATE] = calculateExpiryDate(
          plan,
          updateData[FIELD_NAMES.PLAN_AMOUNT],
        );
      }
    }

    const updatedItem = await prisma.motorcycle.update({
      where: { [FIELD_NAMES.ID]: id },
      data: updateData,
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.TITLE]: true,
      },
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:*"),
    ]);

    return res.json(updatedItem);
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UPDATE_FAILED,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const deleteMotorcycle = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await prisma.motorcycle.delete({ where: { [FIELD_NAMES.ID]: id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("motorcycles:*"),
    ]);

    return res.json({ [FIELD_NAMES.MESSAGE]: SUCCESS_MESSAGES.DELETED });
  } catch (error) {
    const err = error as Error;
    return res.status(404).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.ITEM_NOT_FOUND,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};
