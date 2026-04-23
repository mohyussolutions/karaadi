import { Request, Response } from "express";
import { CACHE_KEYS, CACHE_TTL } from "src/config/config.constants.ts";
import { getPageAndSkip } from "src/hooks/usePagination.ts";
import prisma from "src/core/utils/db.ts";
import {
  calculateExpiryDate,
  getDaysUntilExpiry,
  formatExpiryDate,
  isExpired,
} from "src/hooks/useExpire.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { notifyMatchingSubscribers } from "./subscriptionController.ts";

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
  UPDATED_AT: "updatedAt",
} as const;

const ERROR_MESSAGES = {
  SERVER_ERROR: "Server Error",
  INVALID_ID: "Invalid ID format",
  NOT_FOUND: "Job not found",
  CREATE_FAILED: "Create failed",
  UPDATE_FAILED: "Update failed",
  ITEM_NOT_FOUND: "Item not found",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Job deleted successfully",
} as const;

const selectUserBasic = {
  select: { username: true, email: true, phone: true, profileImage: true },
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

export const getTotalJobs = async (req: Request, res: Response) => {
  try {
    const cacheKey = CACHE_KEYS.JOBS_TOTAL_COUNT;
    const total = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.job.count({
          where: {
            isPaid: true,
            OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }],
          },
        });
      },
      CACHE_TTL.STATS,
    );
    return res.json({ totalJobs: total });
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { pageNum, sizeNum, skip } = getPageAndSkip(req.query);
    const cacheKey = `${CACHE_KEYS.JOBS_ALL_PAID}:page:${pageNum}:limit:${sizeNum}`;
    const jobs = await cacheManager.withCache(
      cacheKey,
      async () => {
        return await prisma.job.findMany({
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
            salary: true,
            region: true,
            city: true,
            employmentType: true,
            experienceLevel: true,
            images: true,
            createdAt: true,
            expiryDate: true,
            isPaid: true,
            isBasic30: true,
            isStandard60: true,
            isPremium90: true,
            maGaday: true,
            user: selectUserBasic,
          },
        });
      },
      CACHE_TTL.LIST,
    );
    return res.json(jobs.map(formatItem));
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_ID });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        salary: true,
        mainCategory: true,
        category: true,
        subcategory: true,
        region: true,
        city: true,
        employmentType: true,
        experienceLevel: true,
        images: true,
        createdAt: true,
        expiryDate: true,
        isPaid: true,
        isBasic30: true,
        isStandard60: true,
        isPremium90: true,
        maGaday: true,
        userId: true,
        user: selectUserBasic,
        fee: true,
        plan: true,
      },
    });

    if (!job) {
      const fallback = await prisma.job.findFirst({
        where: {
          OR: [
            { id },
            { title: { contains: id, mode: "insensitive" } },
            { description: { contains: id, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          salary: true,
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
          userId: true,
          user: selectUserBasic,
          fee: true,
          plan: true,
        },
      });
      if (!fallback)
        return res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND, id });
      return res.json({ ...formatItem(fallback), foundByFallback: true });
    }

    return res.json(formatItem(job));
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const { planId, planAmount, category, subcategory, ...jobData } = req.body;

    let expiryDate = null;
    let finalPlanAmount = 0;

    if (planId && planAmount) {
      const plan = await prisma.subPlan.findUnique({ where: { id: planId } });
      if (plan) {
        expiryDate = calculateExpiryDate(plan, planAmount);
        finalPlanAmount = planAmount;
      }
    }

    const newJob = await prisma.job.create({
      data: {
        ...jobData,
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
        [FIELD_NAMES.IS_PAID]: false,
        maGaday: false,
        isBasic30: false,
        isStandard60: false,
        isPremium90: false,
        [FIELD_NAMES.PLAN_ID]: planId || null,
        [FIELD_NAMES.PLAN_AMOUNT]: finalPlanAmount,
        [FIELD_NAMES.EXPIRY_DATE]: expiryDate,
      },
      select: { id: true, title: true, user: selectUserBasic },
    });

    await cacheManager.deletePattern("jobs:*");

    notifyMatchingSubscribers("job", newJob.id, {
      title: jobData.title,
      price: parseFloat(jobData.price) || 0,
      mainCategory: jobData.mainCategory ?? "Jobs",
      subCategory: Array.isArray(subcategory) ? subcategory[0] : subcategory,
      region: jobData.region,
      city: jobData.city,
      posterId: jobData.userId,
    }).catch(console.error);

    return res.status(201).json(newJob);
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ message: ERROR_MESSAGES.CREATE_FAILED, error: err.message });
  }
};

export const updateJobPayment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { paymentId, planId, planType, planAmount } = req.body;

    const item = await prisma.job.findUnique({
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

    const updatedItem = await prisma.job.update({
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
          jobId: id,
          status: PAYMENT_STATUS.COMPLETED,
          paidAt: new Date(),
          [FIELD_NAMES.PLAN_AMOUNT]: amountToUse,
        },
      });

    await cacheManager.deletePattern("jobs:*");

    return res.json({ success: true, data: updatedItem });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

export const updateJob = async (req: Request, res: Response) => {
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

    const updatedItem = await prisma.job.update({
      where: { id },
      data: updateData,
      select: { id: true, isPaid: true, title: true },
    });

    await cacheManager.deletePattern("jobs:*");

    return res.json(updatedItem);
  } catch (error) {
    const err = error as Error;
    return res.status(400).json({
      message: ERROR_MESSAGES.UPDATE_FAILED,
      error: err.message,
    });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_ID });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND });
    }

    await prisma.job.delete({ where: { id } });

    await cacheManager.deletePattern("jobs:*");

    return res.json({ message: SUCCESS_MESSAGES.DELETED });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR, error: error.message });
  }
};
