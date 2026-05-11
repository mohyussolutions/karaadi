import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import { convertImages } from "src/core/utils/imageUtils.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { getPageAndSkip } from "src/hooks/usePagination.ts";
import { getDaysUntilExpiry, formatExpiryDate, isExpired } from "src/hooks/useExpire.ts";
import { AuthRequest } from "src/types/index.ts";
import cacheManager from "src/services/redis/cacheManager.ts";
import { checkBusinessListingLimit } from "src/core/utils/businessListingFlags.ts";
import { SORT_DIRECTION } from "src/config/shared.constants.ts";
import {
  FIELD_NAMES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CACHE_KEYS,
  selectUserBasic,
  selectUserMinimal,
  prepareTractorData,
  formatItem,
} from "src/config/constants/farmequipment.constants.ts";


export const createfarmequipment = async (req: AuthRequest, res: Response) => {
  try {
    const userId =
      req.body.userId || req.user?.id || req.user?._id || req.user?.sub;
    if (!userId) {
      return res.status(401).json({
        [FIELD_NAMES.SUCCESS]: false,
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    if (req.body.businessId) {
      const limit = await checkBusinessListingLimit(req.body.businessId);
      if (limit.limitReached) {
        return res.status(403).json({ success: false, message: "Listing limit reached", current: limit.current, max: limit.max });
      }
    }

    const data = await prepareTractorData(req.body, userId);
    const newTractor = await prisma.farmequipment.create({
      data,
      include: { [FIELD_NAMES.USER]: selectUserBasic },
    });
    await Promise.all([
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
      cacheManager.deletePattern(`businesses:my:${userId}*`),
    ]);
    if (newTractor[FIELD_NAMES.IS_PAID]) {
      notifyMatchingSubscribers("farmequipment", newTractor.id, {
        title: newTractor.title,
        price: newTractor.price,
        mainCategory: newTractor.mainCategory,
        region: newTractor.region,
        city: newTractor.city,
        brand: newTractor.make,
        model: newTractor.farmequipmentModel,
        posterId: newTractor.userId,
      }).catch((err) => console.error("notifyMatchingSubscribers error:", err));
    }
    return res
      .status(201)
      .json({ [FIELD_NAMES.SUCCESS]: true, [FIELD_NAMES.DATA]: newTractor });
  } catch (error: any) {
    return res.status(400).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.CREATE_FAILED,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const updateTractor = async (req: AuthRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const oldTractor = await prisma.farmequipment.findUnique({
      where: { [FIELD_NAMES.ID]: id },
      select: { [FIELD_NAMES.IS_PAID]: true },
    });
    let updatedTractor;
    if (Object.keys(req.body).length === 1 && req.body.isPaid !== undefined) {
      updatedTractor = await prisma.farmequipment.update({
        where: { [FIELD_NAMES.ID]: id },
        data: { [FIELD_NAMES.IS_PAID]: req.body.isPaid },
        include: { [FIELD_NAMES.USER]: selectUserBasic },
      });
    } else {
      const existing = await prisma.farmequipment.findUnique({
        where: { [FIELD_NAMES.ID]: id },
      });
      if (!existing) {
        return res.status(404).json({
          [FIELD_NAMES.SUCCESS]: false,
          [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND,
        });
      }
      const userId = req.body.userId || req.user?.id || req.user?._id;
      const merged = { ...existing, ...req.body };
      const data = await prepareTractorData(merged, userId);
      let expiryDateToCheck: Date | null = data.expiryDate ?? null;
      if (expiryDateToCheck === null)
        expiryDateToCheck = existing.expiryDate ?? null;
      if (expiryDateToCheck && isExpired(expiryDateToCheck))
        data[FIELD_NAMES.IS_PAID] = false;
      updatedTractor = await prisma.farmequipment.update({
        where: { [FIELD_NAMES.ID]: id },
        data,
        include: { [FIELD_NAMES.USER]: selectUserBasic },
      });
    }
    if (!oldTractor?.isPaid && updatedTractor[FIELD_NAMES.IS_PAID]) {
      notifyMatchingSubscribers("farmequipment", updatedTractor.id, {
        title: updatedTractor.title,
        price: updatedTractor.price,
        mainCategory: updatedTractor.mainCategory,
        region: updatedTractor.region,
        city: updatedTractor.city,
        brand: updatedTractor.make,
        model: updatedTractor.farmequipmentModel,
        posterId: updatedTractor.userId,
      }).catch((err) => console.error("notifyMatchingSubscribers error:", err));
    }
    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("tractors:*:all"),
    ]);
    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.DATA]: updatedTractor,
    });
  } catch (error: any) {
    return res.status(400).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UPDATE_FAILED,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const deleteTractor = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.farmequipment.delete({ where: { [FIELD_NAMES.ID]: id } });
    await Promise.all([
      cacheManager.delete(CACHE_KEYS.DETAIL(id)),
      cacheManager.deletePattern("tractors:*:all"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);
    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.MESSAGE]: SUCCESS_MESSAGES.DELETED,
    });
  } catch (error: any) {
    return res.status(400).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.DELETE_FAILED,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const getAllTractorsIncludingUnpaid = async (
  req: Request,
  res: Response,
) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const cacheKey = CACHE_KEYS.ADMIN_ALL(pageNum, sizeNum);
    const tractors = await cacheManager.withCache(
      cacheKey,
      async () => {
        const items = await prisma.farmequipment.findMany({
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.REGION]: true,
            [FIELD_NAMES.CITY]: true,
            [FIELD_NAMES.IMAGES]: true,
            [FIELD_NAMES.CREATED_AT]: true,
            [FIELD_NAMES.EXPIRY_DATE]: true,
            [FIELD_NAMES.IS_PAID]: true,
            [FIELD_NAMES.USER]: {
              select: {
                [FIELD_NAMES.USERNAME]: true,
                [FIELD_NAMES.EMAIL]: true,
                [FIELD_NAMES.PHONE]: true,
                [FIELD_NAMES.PROFILE_IMAGE]: true,
              },
            },
          },
          orderBy: { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
          skip,
          take: sizeNum,
        });
        return items.map((item) => ({
          ...item,
          [FIELD_NAMES.IS_EXPIRED]: isExpired(item[FIELD_NAMES.EXPIRY_DATE]),
          [FIELD_NAMES.DAYS_UNTIL_EXPIRY]: getDaysUntilExpiry(
            item[FIELD_NAMES.EXPIRY_DATE],
          ),
          [FIELD_NAMES.FORMATTED_EXPIRY]: formatExpiryDate(
            item[FIELD_NAMES.EXPIRY_DATE],
          ),
        }));
      },
      CACHE_TTL.LIST,
    );
    return res.json(Array.isArray(tractors) ? tractors.map((t: any) => convertImages(t, "traktor")) : convertImages(tractors, "traktor"));
  } catch (error: any) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: `${ERROR_MESSAGES.FETCH_ERROR} all`,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const getTotalFarmEquipment = async (_req: Request, res: Response) => {
  try {
    const totalFarmEquipment = await cacheManager.withCache(
      "farmequipment:total",
      async () => await prisma.farmequipment.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalFarmEquipment });
  } catch (error: any) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: "Error getting total",
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const getAllTractors = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const cacheKey = CACHE_KEYS.PUBLIC_ALL(pageNum, sizeNum);
    const tractors = await cacheManager.withCache(
      cacheKey,
      async () => {
        const items = await prisma.farmequipment.findMany({
          where: { [FIELD_NAMES.IS_PAID]: true },
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
        return items.map(formatItem);
      },
      CACHE_TTL.LIST,
    );
    return res.json(Array.isArray(tractors) ? tractors.map((t: any) => convertImages(t, "traktor")) : convertImages(tractors, "traktor"));
  } catch (error: any) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: `${ERROR_MESSAGES.FETCH_ERROR} public`,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const getTractorById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cacheKey = CACHE_KEYS.DETAIL(id);

    const tractor = await cacheManager.withCache(
      cacheKey,
      async () => {
        const item = await prisma.farmequipment.findUnique({
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
            [FIELD_NAMES.MAKE]: true,
            [FIELD_NAMES.MODEL]: true,
            [FIELD_NAMES.TYPE]: true,
            [FIELD_NAMES.CONDITION]: true,
            [FIELD_NAMES.ENGINE_POWER]: true,
            [FIELD_NAMES.FUEL_TYPE]: true,
            [FIELD_NAMES.YEAR]: true,
            [FIELD_NAMES.HOURS]: true,
            [FIELD_NAMES.USER]: selectUserBasic,
            [FIELD_NAMES.FEE]: true,
            [FIELD_NAMES.PLAN]: true,
          },
        });
        if (!item) return null;
        return formatItem(item);
      },
      CACHE_TTL.DETAIL,
    );

    if (!tractor) {
      const fallback = await prisma.farmequipment.findFirst({
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
          [FIELD_NAMES.DESCRIPTION]: true,
          [FIELD_NAMES.PRICE]: true,
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
      return res.json(convertImages({ ...formatItem(fallback), [FIELD_NAMES.FOUND_BY_FALLBACK]: true }, "traktor"));
    }
    return res.json(convertImages(tractor, "traktor"));
  } catch (error: any) {
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: `${ERROR_MESSAGES.FETCH_ERROR} detail`,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};
