import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { getBusinessListingFlags, checkBusinessListingLimit } from "src/core/utils/businessListingFlags.ts";
import { convertImages } from "src/core/utils/imageUtils.ts";

import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
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
  USER_ID: "userId",
  PLAN_ID: "planId",
  PLAN_AMOUNT: "planAmount",
  MARKETPLACE_ID: "marketplaceId",
  STATUS: "status",
  PAID_AT: "paidAt",
  SUCCESS: "success",
  DATA: "data",
  MESSAGE: "message",
  ERROR: "error",
  FOUND_BY_FALLBACK: "foundByFallback",
  SO: "so",
  EXTRA: "extra",
} as const;

const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  ITEM_NOT_FOUND: "Item not found",
  INVALID_DATA: "Invalid data",
  UPDATE_FAILED: "Update failed",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Item deleted successfully",
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
  ALL_ADMIN: "marketplace:admin:all",
  TOTAL: "marketplace:total",
  PAID_TOTAL: "marketplace:paid:total",
  UNPAID_TOTAL: "marketplace:unpaid:total",
  ALL_PAID: () => `marketplace:all:v2`,
  DETAIL: (id: string) => `marketplace:detail:${id}`,
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

export const getAllMarketplaceItemsAdmin = async (
  req: Request,
  res: Response,
) => {
  try {
    const items = await prisma.marketplace.findMany({
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.TITLE]: true,
        [FIELD_NAMES.DESCRIPTION]: true,
        [FIELD_NAMES.PRICE]: true,
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.CREATED_AT]: true,
        [FIELD_NAMES.EXPIRY_DATE]: true,
        [FIELD_NAMES.IMAGES]: true,
        [FIELD_NAMES.USER]: selectUserBasic,
        [FIELD_NAMES.FEE]: true,
        [FIELD_NAMES.PLAN]: true,
        [FIELD_NAMES.MAIN_CATEGORY]: true,
        [FIELD_NAMES.CATEGORY]: true,
        [FIELD_NAMES.SUBCATEGORY]: true,
        [FIELD_NAMES.IS_BASIC_30]: true,
        [FIELD_NAMES.IS_STANDARD_60]: true,
        [FIELD_NAMES.IS_PREMIUM_90]: true,
        [FIELD_NAMES.CITY]: true,
        [FIELD_NAMES.REGION]: true,
      },
      orderBy: { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
    });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const getTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.marketplace.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalMarketplaceItems: total });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const getPaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.PAID_TOTAL,
      async () =>
        await prisma.marketplace.count({
          where: { [FIELD_NAMES.IS_PAID]: true },
        }),
      CACHE_TTL.STATS,
    );
    return res.json({ paidTotalMarketplaceItems: total });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const getUnpaidTotalMarketplaceItems = async (
  _req: Request,
  res: Response,
) => {
  try {
    const total = await cacheManager.withCache(
      CACHE_KEYS.UNPAID_TOTAL,
      async () =>
        await prisma.marketplace.count({
          where: { [FIELD_NAMES.IS_PAID]: false },
        }),
      CACHE_TTL.STATS,
    );
    return res.json({ unpaidTotalMarketplaceItems: total });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const getAllMarketplaceItems = async (req: Request, res: Response) => {
  try {
    const items = await cacheManager.withCache(
      CACHE_KEYS.ALL_PAID(),
      async () => {
        return await prisma.marketplace.findMany({
          where: {
            OR: [
              { [FIELD_NAMES.EXPIRY_DATE]: null },
              { [FIELD_NAMES.EXPIRY_DATE]: { gt: new Date() } },
            ],
          },
          orderBy: [
            { [FIELD_NAMES.IS_PREMIUM_90]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.IS_STANDARD_60]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.IS_BASIC_30]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.MA_GADAY]: SORT_DIRECTION.DESC },
            { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
          ],
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.IS_BASIC_30]: true,
            [FIELD_NAMES.IS_STANDARD_60]: true,
            [FIELD_NAMES.IS_PREMIUM_90]: true,
            [FIELD_NAMES.MA_GADAY]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.REGION]: true,
            [FIELD_NAMES.CATEGORY]: true,
            [FIELD_NAMES.SUBCATEGORY]: true,
            [FIELD_NAMES.MAIN_CATEGORY]: true,
          },
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(items.map((i: any) => convertImages(formatItem(i), "marketplace")));
  } catch (error) {
    return res
      .status(500)
      .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getMarketplaceItemById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await cacheManager.withCache(
      CACHE_KEYS.DETAIL(id),
      async () => {
        return await prisma.marketplace.findUnique({
          where: { [FIELD_NAMES.ID]: id },
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.USER]: selectUserBasic,
            [FIELD_NAMES.FEE]: true,
            [FIELD_NAMES.PLAN]: true,
            [FIELD_NAMES.IS_BASIC_30]: true,
            [FIELD_NAMES.IS_STANDARD_60]: true,
            [FIELD_NAMES.IS_PREMIUM_90]: true,
            [FIELD_NAMES.MA_GADAY]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.REGION]: true,
          },
        });
      },
      CACHE_TTL.DETAIL,
    );

    if (!item) {
      const fallback = await prisma.marketplace.findFirst({
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
          [FIELD_NAMES.IMAGES]: true,
          [FIELD_NAMES.IS_PAID]: true,
          [FIELD_NAMES.EXPIRY_DATE]: true,
          [FIELD_NAMES.CREATED_AT]: true,
          [FIELD_NAMES.USER]: selectUserBasic,
          [FIELD_NAMES.FEE]: true,
          [FIELD_NAMES.PLAN]: true,
          [FIELD_NAMES.IS_BASIC_30]: true,
          [FIELD_NAMES.IS_STANDARD_60]: true,
          [FIELD_NAMES.IS_PREMIUM_90]: true,
          [FIELD_NAMES.MA_GADAY]: true,
          [FIELD_NAMES.CITY]: true,
          [FIELD_NAMES.REGION]: true,
        },
      });
      if (!fallback)
        return res.status(404).json({
          [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.ITEM_NOT_FOUND,
          [FIELD_NAMES.ID]: id,
        });
      return res.json(convertImages({ ...formatItem(fallback), [FIELD_NAMES.FOUND_BY_FALLBACK]: true }, "marketplace"));
    }
    return res.json(convertImages(formatItem(item), "marketplace"));
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};

export const createMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const {
      planId,
      planAmount,
      category,
      subcategory,
      businessId,
      ...marketplaceData
    } = req.body;
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

    const biz = await getBusinessListingFlags(businessId);
    if (biz.isPaidByBusiness) expiryDate = expiryDate ?? biz.expiryDate;

    if (businessId) {
      const limit = await checkBusinessListingLimit(businessId);
      if (limit.limitReached) {
        return res.status(403).json({ message: "Listing limit reached", current: limit.current, max: limit.max });
      }
    }

    const newItem = await prisma.marketplace.create({
      data: {
        ...marketplaceData,
        businessId: businessId ?? null,
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
        [FIELD_NAMES.IS_PAID]: biz.isPaidByBusiness,
        [FIELD_NAMES.MA_GADAY]: false,
        [FIELD_NAMES.IS_BASIC_30]: biz.isBasic30,
        [FIELD_NAMES.IS_STANDARD_60]: biz.isStandard60,
        [FIELD_NAMES.IS_PREMIUM_90]: biz.isPremium90,
        [FIELD_NAMES.PLAN_ID]: planId,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
      },
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.TITLE]: true,
        [FIELD_NAMES.USER]: selectUserBasic,
      },
    });
    cacheManager.deletePattern("marketplace:*").catch(() => {});
    cacheManager.deletePattern(`businesses:my:${marketplaceData.userId}*`).catch(() => {});
    notifyMatchingSubscribers("marketplace", newItem.id, {
      title: marketplaceData.title,
      price: parseFloat(marketplaceData.price) || 0,
      mainCategory: marketplaceData.mainCategory ?? "Marketplace",
      subCategory: Array.isArray(subcategory) ? subcategory[0] : subcategory,
      region: marketplaceData.region,
      city: marketplaceData.city,
      posterId: marketplaceData.userId,
    }).catch(console.error);
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(400).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_DATA,
      [FIELD_NAMES.ERROR]: (error as any).message,
    });
  }
};

export const updateMarketplacePayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId, planType, planAmount } = req.body;
    const item = await prisma.marketplace.findUnique({
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

    const updatedItem = await prisma.marketplace.update({
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
          [FIELD_NAMES.MARKETPLACE_ID]: id,
          [FIELD_NAMES.STATUS]: PAYMENT_STATUS.COMPLETED,
          [FIELD_NAMES.PAID_AT]: new Date(),
          [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        },
      });
    cacheManager.deletePattern("marketplace:*").catch(() => {});
    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.DATA]: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

export const updateMarketplaceItem = async (req: Request, res: Response) => {
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
    const updatedItem = await prisma.marketplace.update({
      where: { [FIELD_NAMES.ID]: id },
      data: updateData,
      select: {
        [FIELD_NAMES.ID]: true,
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.TITLE]: true,
      },
    });
    cacheManager.deletePattern("marketplace:*").catch(() => {});
    return res.json(updatedItem);
  } catch (error) {
    return res.status(400).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UPDATE_FAILED,
      [FIELD_NAMES.ERROR]:
        error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteMarketplaceItem = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.marketplace.delete({ where: { [FIELD_NAMES.ID]: id } });
    cacheManager.deletePattern("marketplace:*").catch(() => {});
    return res.json({ [FIELD_NAMES.MESSAGE]: SUCCESS_MESSAGES.DELETED });
  } catch (error) {
    return res.status(404).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.ITEM_NOT_FOUND,
      [FIELD_NAMES.ERROR]: (error as Error).message,
    });
  }
};
