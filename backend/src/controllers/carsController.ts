import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "src/core/utils/db.ts";
import { convertImages } from "src/core/utils/imageUtils.ts";
import {
  calculateExpiryDate,
  formatExpiryDate,
  getDaysUntilExpiry,
  getDefaultExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { getPageAndSkip } from "src/hooks/usePagination.ts";
import { CarQuery, CreateCarBody, PaymentUpdateBody } from "src/types/index.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";
import { getBusinessListingFlags, checkBusinessListingLimit } from "src/core/utils/businessListingFlags.ts";
import cacheManager from "src/services/redis/cacheManager.ts";
import { PLAN_TYPES, SORT_DIRECTION, PAYMENT_STATUS, LISTING_STATUS } from "src/config/shared.constants.ts";
import { FIELD_NAMES, ERROR_MESSAGES, SUCCESS_MESSAGES, CACHE_KEYS, selectUserBasic, selectUserMinimal, formatItem} from "src/config/constants/cars.constants.ts";


export const patchCarIsPaid = async (req: Request, res: Response) => {
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
    const updated = await prisma.car.update({
      where: { [FIELD_NAMES.ID]: id },
      data: { [FIELD_NAMES.IS_PAID]: isPaid },
    });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.delete(CACHE_KEYS.UNFILTERED),
      cacheManager.deletePattern(`${CACHE_KEYS.PAID_PREFIX}:*`),
      cacheManager.delete(CACHE_KEYS.TOTAL),
    ]);

    return res.json({ [FIELD_NAMES.SUCCESS]: true, car: updated });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getTotalCars = async (_req: Request, res: Response) => {
  try {
    const totalCars = await cacheManager.withCache(
      CACHE_KEYS.TOTAL,
      async () => await prisma.car.count(),
      CACHE_TTL.STATS,
    );
    return res.json({ totalCars });
  } catch (error) {
    return res
      .status(500)
      .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getAllCarsIncludingUnpaid = async (
  req: Request,
  res: Response,
) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const cars = await prisma.car.findMany({
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
      },
      orderBy: { [FIELD_NAMES.CREATED_AT]: SORT_DIRECTION.DESC },
      skip,
      take: sizeNum,
    });
    return res.json(cars.map((c: any) => convertImages(formatItem(c), "cars")));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const { type, listingType, region, city, subcategory, category } =
      req.query as CarQuery;
    const cacheKey = `${CACHE_KEYS.PAID_PREFIX}:page:${pageNum}:limit:${sizeNum}:type:${type || "all"}:listingType:${listingType || "all"}:region:${region || "all"}:city:${city || "all"}:category:${category || "all"}`;

    const cars = await cacheManager.withCache(
      cacheKey,
      async () => {
        const filter: Prisma.CarWhereInput = {
          [FIELD_NAMES.IS_PAID]: true,
          OR: [
            { [FIELD_NAMES.EXPIRY_DATE]: null },
            { [FIELD_NAMES.EXPIRY_DATE]: { gt: new Date() } },
          ],
        };

        if (type) filter.title = { contains: type, mode: "insensitive" };
        if (region) filter[FIELD_NAMES.REGION] = region;
        if (city) filter[FIELD_NAMES.CITY] = city;
        if (subcategory) filter[FIELD_NAMES.SUBCATEGORY] = { has: subcategory };
        if (category) filter[FIELD_NAMES.CATEGORY] = { has: category };

        return await prisma.car.findMany({
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

    return res.json(cars.map((c: any) => convertImages(formatItem(c), "cars")));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_ID });
    }

    const cacheKey = `${CACHE_KEYS.DETAIL_PREFIX}:${id}`;

    const car = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.car.findUnique({
          where: { [FIELD_NAMES.ID]: id },
          select: {
            [FIELD_NAMES.ID]: true,
            [FIELD_NAMES.TITLE]: true,
            [FIELD_NAMES.DESCRIPTION]: true,
            [FIELD_NAMES.PRICE]: true,
            [FIELD_NAMES.MAIN_CATEGORY]: true,
            [FIELD_NAMES.CATEGORY]: true,
            [FIELD_NAMES.SUBCATEGORY]: true,
            [FIELD_NAMES.BRAND]: true,
            [FIELD_NAMES.VEHICLE_MODEL]: true,
            [FIELD_NAMES.YEAR]: true,
            [FIELD_NAMES.MILEAGE]: true,
            [FIELD_NAMES.TRANSMISSION]: true,
            [FIELD_NAMES.FUEL_TYPE]: true,
            [FIELD_NAMES.COLOR]: true,
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
      },
      CACHE_TTL.DETAIL,
    );

    if (!car) {
      const fallback = await prisma.car.findFirst({
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
      if (!fallback) {
        return res.status(404).json({
          [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND,
          [FIELD_NAMES.ID]: id,
        });
      }
      return res.json(convertImages({ ...formatItem(fallback), [FIELD_NAMES.FOUND_BY_FALLBACK]: true }, "cars"));
    }

    return res.json(convertImages(formatItem(car), "cars"));
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const createCar = async (
  req: Request<{}, {}, CreateCarBody>,
  res: Response,
) => {
  try {
    const {
      userId,
      title,
      description,
      price,
      mainCategory,
      category,
      subcategory,
      year,
      mileage,
      transmission,
      fuelType,
      region,
      city,
      images,
      planId,
      planAmount,
      feeId,
      feeAmount,
      businessId,
    } = req.body;

    const brand: string = req.body.brand || req.body.make || "";
    const vehicleModel: string = req.body.vehicleModel || req.body.model || "";
    const color: string = req.body.color || "";
    const trim: string | null = req.body.trim || null;
    const gearbox: string | null = req.body.gearbox || null;
    const engineSize: string | null = req.body.engineSize || null;
    const condition: string | null = req.body.condition || null;
    const doors: number | null = req.body.doors ? Number(req.body.doors) : null;

    if (!userId) {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.MISSING_USER_ID });
    }

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

    const newCar = await prisma.car.create({
      data: {
        [FIELD_NAMES.USER_ID]: userId,
        businessId: businessId ?? null,
        [FIELD_NAMES.TITLE]: title,
        [FIELD_NAMES.DESCRIPTION]: description,
        [FIELD_NAMES.PRICE]: price,
        [FIELD_NAMES.MAIN_CATEGORY]: mainCategory,
        [FIELD_NAMES.CATEGORY]: Array.isArray(category) ? category : [],
        [FIELD_NAMES.SUBCATEGORY]: Array.isArray(subcategory)
          ? subcategory
          : [],
        [FIELD_NAMES.BRAND]: brand,
        [FIELD_NAMES.VEHICLE_MODEL]: vehicleModel,
        make: req.body.make || null,
        model: req.body.model || null,
        trim,
        [FIELD_NAMES.YEAR]: year ? Number(year) : null,
        [FIELD_NAMES.MILEAGE]: mileage ? Number(mileage) : null,
        [FIELD_NAMES.TRANSMISSION]: transmission || null,
        gearbox,
        [FIELD_NAMES.FUEL_TYPE]: fuelType || null,
        engineSize,
        condition,
        doors,
        [FIELD_NAMES.COLOR]: color,
        [FIELD_NAMES.REGION]: region,
        [FIELD_NAMES.CITY]: city,
        [FIELD_NAMES.IMAGES]: Array.isArray(images) ? images : [],
        [FIELD_NAMES.IS_PAID]: biz.isPaidByBusiness,
        [FIELD_NAMES.MA_GADAY]: false,
        [FIELD_NAMES.IS_BASIC_30]: biz.isBasic30,
        [FIELD_NAMES.IS_STANDARD_60]: biz.isStandard60,
        [FIELD_NAMES.IS_PREMIUM_90]: biz.isPremium90,
        [FIELD_NAMES.PLAN_ID]: planId || null,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.FEE_ID]: feeId || null,
        [FIELD_NAMES.FEE_AMOUNT]: feeAmount || 0,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
      },
      include: { [FIELD_NAMES.USER]: selectUserBasic },
    });

    await Promise.all([
      cacheManager.deletePattern("cars:all:*"),
      cacheManager.delete(CACHE_KEYS.TOTAL),
      cacheManager.deletePattern(`businesses:my:${userId}*`),
    ]);

    notifyMatchingSubscribers("car", newCar.id, {
      title,
      price: price ?? 0,
      mainCategory: mainCategory ?? "Cars",
      subCategory: Array.isArray(subcategory) ? subcategory[0] : subcategory,
      region,
      city,
      brand,
      model: vehicleModel,
      posterId: userId,
    }).catch(console.error);

    return res.status(201).json(newCar);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.CREATE_FAILED,
      [FIELD_NAMES.ERROR]: err.message,
    });
  }
};

export const updateCarPayment = async (
  req: Request<{ id: string }, {}, PaymentUpdateBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({
        [FIELD_NAMES.SUCCESS]: false,
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_ID,
      });
    }

    const { paymentId, planId, planType, planAmount } = req.body;

    const car = await prisma.car.findUnique({
      where: { [FIELD_NAMES.ID]: id },
    });
    if (!car) {
      return res.status(404).json({
        [FIELD_NAMES.SUCCESS]: false,
        [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND,
      });
    }

    const subPlan = await prisma.subPlan.findFirst({
      where: { isActive: true },
    });

    const amountToUse = planAmount || car[FIELD_NAMES.PLAN_AMOUNT];
    const expiryDate =
      planId && subPlan && amountToUse
        ? calculateExpiryDate(subPlan, amountToUse)
        : getDefaultExpiryDate();

    const priorityFlags = {
      [FIELD_NAMES.IS_BASIC_30]: planType === PLAN_TYPES.BASIC,
      [FIELD_NAMES.IS_STANDARD_60]: planType === PLAN_TYPES.STANDARD,
      [FIELD_NAMES.IS_PREMIUM_90]: planType === PLAN_TYPES.PREMIUM,
    };

    const updatedCar = await prisma.car.update({
      where: { [FIELD_NAMES.ID]: id },
      data: {
        [FIELD_NAMES.IS_PAID]: true,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
        [FIELD_NAMES.PLAN_ID]: planId || car[FIELD_NAMES.PLAN_ID],
        [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        ...priorityFlags,
      },
    });

    if (paymentId) {
      await prisma.payment.updateMany({
        where: { [FIELD_NAMES.ID]: paymentId },
        data: {
          [FIELD_NAMES.CAR_ID]: id,
          [FIELD_NAMES.STATUS]: PAYMENT_STATUS.COMPLETED,
          [FIELD_NAMES.PAID_AT]: new Date(),
        },
      });
    }

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
    ]);

    return res.json({
      [FIELD_NAMES.SUCCESS]: true,
      [FIELD_NAMES.DATA]: updatedCar,
    });
  } catch (error) {
    return res.status(500).json({
      [FIELD_NAMES.SUCCESS]: false,
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
};

export const updateCar = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_ID });
    }

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

    const updatedCar = await prisma.car.update({
      where: { [FIELD_NAMES.ID]: id },
      data: updateData,
      include: { [FIELD_NAMES.USER]: selectUserBasic },
    });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
    ]);

    return res.json(updatedCar);
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

export const deleteCar = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INVALID_ID });
    }

    await prisma.car.delete({ where: { [FIELD_NAMES.ID]: id } });

    await Promise.all([
      cacheManager.delete(`${CACHE_KEYS.DETAIL_PREFIX}:${id}`),
      cacheManager.deletePattern("cars:all:*"),
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
