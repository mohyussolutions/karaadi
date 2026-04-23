import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import prisma from "src/core/utils/db.ts";
import {
  calculateExpiryDate,
  formatExpiryDate,
  getDaysUntilExpiry,
  getDefaultExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { getPageAndSkip } from "src/hooks/usePagination.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import { CreateBoatBody, PaymentUpdateBody } from "src/types/index.ts";

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
  USER_ID: "userId",
  PLAN_ID: "planId",
  PLAN_AMOUNT: "planAmount",
  BOAT_ID: "boatId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  TYPE: "type",
  BOAT_MODEL: "boatModel",
  TRANSMISSION: "transmission",
  COLOR: "color",
  FEE_ID: "feeId",
  FEE_AMOUNT: "feeAmount",
  IS_EXPIRED: "isExpired",
  DAYS_UNTIL_EXPIRY: "daysUntilExpiry",
  FORMATTED_EXPIRY: "formattedExpiry",
  SELECTED_PLAN: "selectedPlan",
  NAME: "name",
  DURATION: "duration",
  DETAILS: "details",
  COUNT: "count",
} as const;

const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  NOT_FOUND: "Boat not found",
  INVALID_ID: "Invalid ID",
  USER_ID_REQUIRED: "User ID required",
  CREATE_FAILED: "Failed to create boat listing",
  UPDATE_FAILED: "Update failed",
  IS_PAID_MUST_BE_BOOLEAN: "isPaid must be boolean",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Boat deleted successfully",
} as const;

const DEFAULT_VALUES = {
  MAIN_CATEGORY: "Boats",
  PRICE: 0,
  FEE_AMOUNT: 0,
  PLAN_AMOUNT: 0,
} as const;

const CACHE_KEYS = {
  ALL_ADMIN: "boats:admin:all",
  TOTAL: "boats:total",
  PAID_TOTAL: "boats:paid:total",
  UNPAID_TOTAL: "boats:unpaid:total",
  ALL_PAID: (page: number, limit: number) =>
    `boats:paid:page:${page}:limit:${limit}`,
  DETAIL: (id: string) => `boat:detail:${id}`,
};

const selectUserBasic = {
  select: {
    [FIELD_NAMES.ID]: true,
    [FIELD_NAMES.USERNAME]: true,
    [FIELD_NAMES.EMAIL]: true,
    [FIELD_NAMES.PHONE]: true,
    [FIELD_NAMES.PROFILE_IMAGE]: true,
  },
};

const selectUserMinimal = {
  select: {
    [FIELD_NAMES.USERNAME]: true,
  },
};

const boatInclude = {
  [FIELD_NAMES.USER]: selectUserBasic,
  [FIELD_NAMES.FEE]: true,
  [FIELD_NAMES.PLAN]: true,
};

const ensureSingleString = (id: any): string => {
  return Array.isArray(id) ? id[0] : id || "";
};

const formatBoat = (boat: any) => {
  if (!boat) return null;

  const expired = isExpired(boat[FIELD_NAMES.EXPIRY_DATE]);

  if (expired && boat[FIELD_NAMES.IS_PAID]) {
    prisma.boat
      .update({
        where: { [FIELD_NAMES.ID]: boat[FIELD_NAMES.ID] },
        data: { [FIELD_NAMES.IS_PAID]: false },
      })
      .catch(() => {});
    boat[FIELD_NAMES.IS_PAID] = false;
  }

  let planName = "Basic 30 Days";
  if (boat[FIELD_NAMES.PLAN]) {
    if (boat[FIELD_NAMES.PLAN_AMOUNT] === boat[FIELD_NAMES.PLAN].premium90)
      planName = "Premium 90 Days";
    else if (
      boat[FIELD_NAMES.PLAN_AMOUNT] === boat[FIELD_NAMES.PLAN].standard60
    )
      planName = "Standard 60 Days";
  }

  return {
    ...boat,
    [FIELD_NAMES.IS_EXPIRED]: expired,
    [FIELD_NAMES.STATUS]: expired
      ? LISTING_STATUS.EXPIRED
      : boat[FIELD_NAMES.IS_PAID]
        ? LISTING_STATUS.ACTIVE
        : LISTING_STATUS.PENDING,
    [FIELD_NAMES.DAYS_UNTIL_EXPIRY]: getDaysUntilExpiry(
      boat[FIELD_NAMES.EXPIRY_DATE],
    ),
    [FIELD_NAMES.FORMATTED_EXPIRY]: formatExpiryDate(
      boat[FIELD_NAMES.EXPIRY_DATE],
    ),
    [FIELD_NAMES.SELECTED_PLAN]: boat[FIELD_NAMES.PLAN]
      ? {
          [FIELD_NAMES.NAME]: planName,
          [FIELD_NAMES.DURATION]: expired
            ? 0
            : getDaysUntilExpiry(boat[FIELD_NAMES.EXPIRY_DATE]),
          [FIELD_NAMES.PRICE]: boat[FIELD_NAMES.PLAN_AMOUNT],
          [FIELD_NAMES.DETAILS]: boat[FIELD_NAMES.PLAN],
        }
      : null,
  };
};

export const patchBoatIsPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_ID });
    }
    const { isPaid } = req.body;
    if (typeof isPaid !== "boolean") {
      return res.status(400).json({
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.IS_PAID_MUST_BE_BOOLEAN,
      });
    }
    const updated = await prisma.boat.update({
      where: { [FIELD_NAMES.ID]: id },
      data: { [FIELD_NAMES.IS_PAID]: isPaid },
    });
    await cacheManager.delete(CACHE_KEYS.DETAIL(id));
    await cacheManager.delete(CACHE_KEYS.ALL_ADMIN);
    await cacheManager.deletePattern("boats:paid:*");
    return res.json({ [FIELD_NAMES.SUCCESS]: true, boat: updated });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getTotalBoats = async (_req: Request, res: Response) => {
  try {
    const totalBoats = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.boat.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalBoats });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const getPaidTotalBoats = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.PAID_TOTAL,
      async () =>
        await prisma.boat.count({ where: { [FIELD_NAMES.IS_PAID]: true } }),
      CACHE_TTL.STATS,
    );
    return res.json({ paidTotalBoats: total });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getUnpaidTotalBoats = async (_req: Request, res: Response) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.UNPAID_TOTAL,
      async () =>
        await prisma.boat.count({ where: { [FIELD_NAMES.IS_PAID]: false } }),
      CACHE_TTL.STATS,
    );
    return res.json({ unpaidTotalBoats: total });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getAllBoatsIncludingUnpaid = async (
  req: Request,
  res: Response,
) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);

    const boats = await prisma.boat.findMany({
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.TITLE]: true,
        [FIELD_NAMES.DESCRIPTION]: true,
        [FIELD_NAMES.PRICE]: true,
        [FIELD_NAMES.TYPE]: true,
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
        [FIELD_NAMES.USER]: selectUserMinimal,
        [FIELD_NAMES.FEE]: true,
        [FIELD_NAMES.PLAN]: true,
        [FIELD_NAMES.CATEGORY]: true,
        [FIELD_NAMES.SUBCATEGORY]: true,
      },
      orderBy: { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
      skip,
      take: sizeNum,
    });

    return res.json(boats);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getAllBoats = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const { type, region, city, subCategory, category } = req.query as any;
    const cacheKey = CACHE_KEYS.ALL_PAID(pageNum, sizeNum);

    const boats = await cacheManager.withCache(
      cacheKey,
      async () => {
        const filter: Prisma.BoatWhereInput = {
          [FIELD_NAMES.IS_PAID]: true,
          OR: [
            { [FIELD_NAMES.EXPIRY_DATE]: null },
            { [FIELD_NAMES.EXPIRY_DATE]: { gt: new Date() } },
          ],
        };

        if (type) filter.type = type;
        if (region) filter[FIELD_NAMES.REGION] = region;
        if (city) filter[FIELD_NAMES.CITY] = city;
        if (subCategory) filter[FIELD_NAMES.SUBCATEGORY] = { has: subCategory };
        if (category) filter[FIELD_NAMES.CATEGORY] = { has: category };

        return await prisma.boat.findMany({
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
            [FIELD_NAMES.TYPE]: true,
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
            [FIELD_NAMES.USER]: selectUserMinimal,
          },
        });
      },
      CACHE_TTL.LIST,
    );

    return res.json(boats.map(formatBoat));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getBoatById = async (req: Request, res: Response) => {
  try {
    const id = ensureSingleString(req.params.id);
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const boat = await cacheManager.withCache(
      cacheKey,
      async () => {
        const data = await prisma.boat.findUnique({
          where: { [FIELD_NAMES.ID]: id },
          include: boatInclude,
        });
        return formatBoat(data);
      },
      CACHE_TTL.DETAIL,
    );

    if (!boat)
      return res
        .status(404)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND });

    return res.json(boat);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const createBoat = async (
  req: Request<{}, {}, CreateBoatBody>,
  res: Response,
) => {
  try {
    const {
      userId,
      feeId,
      planId,
      category,
      subcategory,
      images,
      ...boatData
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.USER_ID_REQUIRED });
    }

    let expiryDate = null;
    let finalPlanAmount = 0;

    if (planId && boatData.planAmount) {
      const plan = await prisma.subPlan.findUnique({
        where: { [FIELD_NAMES.ID]: planId },
      });
      if (plan) {
        expiryDate = calculateExpiryDate(plan, boatData.planAmount);
        finalPlanAmount = boatData.planAmount;
      }
    }

    const newBoat = await prisma.boat.create({
      data: {
        ...boatData,
        [FIELD_NAMES.USER_ID]: userId,
        [FIELD_NAMES.FEE_ID]: feeId || null,
        [FIELD_NAMES.PLAN_ID]: planId || null,
        [FIELD_NAMES.CATEGORY]: Array.isArray(category)
          ? category
          : category
            ? [category]
            : [],
        [FIELD_NAMES.SUBCATEGORY]: Array.isArray(subcategory)
          ? subcategory
          : subcategory
            ? [subcategory]
            : [],
        [FIELD_NAMES.IMAGES]: Array.isArray(images) ? images : [],
        [FIELD_NAMES.PRICE]: Number(boatData.price) || DEFAULT_VALUES.PRICE,
        [FIELD_NAMES.FEE_AMOUNT]:
          Number(boatData.feeAmount) || DEFAULT_VALUES.FEE_AMOUNT,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.IS_PAID]: false,
        [FIELD_NAMES.MA_GADAY]: false,
        [FIELD_NAMES.IS_BASIC_30]: false,
        [FIELD_NAMES.IS_STANDARD_60]: false,
        [FIELD_NAMES.IS_PREMIUM_90]: false,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
      },
      include: boatInclude,
    });

    if (!planId) {
      notifyMatchingSubscribers("boat", newBoat.id, {
        title: newBoat.title,
        price: newBoat.price,
        mainCategory: DEFAULT_VALUES.MAIN_CATEGORY,
        subCategory: newBoat.subcategory?.[0],
        region: newBoat.region,
        city: newBoat.city,
        model: newBoat.boatModel,
        posterId: newBoat.userId,
      }).catch(console.error);
    }

    await cacheManager.deletePattern("boats:*");
    return res.status(201).json(formatBoat(newBoat));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.CREATE_FAILED,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const updateBoatPayment = async (
  req: Request<{ id: string }, {}, PaymentUpdateBody>,
  res: Response,
) => {
  try {
    const id = ensureSingleString(req.params.id);
    const { paymentId, planId, planType, planAmount, isPaid } = req.body;

    const boat = await prisma.boat.findUnique({
      where: { [FIELD_NAMES.ID]: id },
    });
    if (!boat) {
      return res.status(404).json({
        [FIELD_NAMES.SUCCESS]: false,
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });

    const amountToUse = planAmount || boat[FIELD_NAMES.PLAN_AMOUNT];
    const expiryDate =
      planId && subPlan && amountToUse
        ? calculateExpiryDate(subPlan, amountToUse)
        : getDefaultExpiryDate();

    const priorityFlags = {
      [FIELD_NAMES.IS_BASIC_30]: planType === PLAN_TYPES.BASIC,
      [FIELD_NAMES.IS_STANDARD_60]: planType === PLAN_TYPES.STANDARD,
      [FIELD_NAMES.IS_PREMIUM_90]: planType === PLAN_TYPES.PREMIUM,
    };

    const updatedBoat = await prisma.boat.update({
      where: { [FIELD_NAMES.ID]: id },
      data: {
        [FIELD_NAMES.IS_PAID]: typeof isPaid === "boolean" ? isPaid : true,
        [FIELD_NAMES.EXPIRY_DATE]:
          typeof isPaid === "boolean" && !isPaid ? null : expiryDate,
        [FIELD_NAMES.PLAN_ID]: planId || boat[FIELD_NAMES.PLAN_ID],
        [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        ...priorityFlags,
      },
      include: boatInclude,
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { [FIELD_NAMES.ID]: paymentId },
        data: {
          [FIELD_NAMES.BOAT_ID]: id,
          [FIELD_NAMES.STATUS]: PAYMENT_STATUS.COMPLETED,
          [FIELD_NAMES.PAID_AT]: new Date(),
        },
      });
    }

    notifyMatchingSubscribers("boat", updatedBoat.id, {
      title: updatedBoat.title,
      price: updatedBoat.price,
      mainCategory: DEFAULT_VALUES.MAIN_CATEGORY,
      subCategory: updatedBoat.subcategory?.[0],
      region: updatedBoat.region,
      city: updatedBoat.city,
      model: updatedBoat.boatModel,
      posterId: updatedBoat.userId,
    }).catch(console.error);

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("boats:*"),
    ]);

    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.DATA]: formatBoat(updatedBoat),
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const updateBoat = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = ensureSingleString(req.params.id);
    const updateData: Record<string, any> = {};

    for (const key in req.body) {
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

    const updatedBoat = await prisma.boat.update({
      where: { [FIELD_NAMES.ID]: id },
      data: updateData,
      include: boatInclude,
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("boats:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json(formatBoat(updatedBoat));
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND });
    }
    return res.status(400).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UPDATE_FAILED,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const deleteBoat = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = ensureSingleString(req.params.id);

    await prisma.boat.delete({ where: { [FIELD_NAMES.ID]: id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("boats:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ [FIELD_NAMES.MESSAGE]: SUCCESS_MESSAGES.DELETED });
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND });
    }
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const checkAndUpdateExpiredListings = async (
  req: Request,
  res: Response,
) => {
  try {
    const now = new Date();
    const expiredBoats = await prisma.boat.updateMany({
      where: {
        [FIELD_NAMES.EXPIRY_DATE]: { lt: now },
        [FIELD_NAMES.IS_PAID]: true,
      },
      data: { [FIELD_NAMES.IS_PAID]: false },
    });

    if (expiredBoats.count > 0) {
      await cacheManager.deletePattern("boats:*");
    }

    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.COUNT]: expiredBoats.count,
    });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const triggerExpiryCheck = async (req: Request, res: Response) => {
  return checkAndUpdateExpiredListings(req, res);
};
