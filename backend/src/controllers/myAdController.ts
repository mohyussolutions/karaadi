import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import { User } from "@prisma/client";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";
import { AuthRequest } from "src/types/authProtection.ts";

const FIELD_NAMES = {
  ID: "id",
  USER_ID: "userId",
  TITLE: "title",
  DESCRIPTION: "description",
  PRICE: "price",
  MA_GADAY: "maGaday",
  UPDATED_AT: "updatedAt",
  USERNAME: "username",
  EMAIL: "email",
  PHONE: "phone",
  PROFILE_IMAGE: "profileImage",
  IS_PAID: "isPaid",
  TYPE: "type",
  USER: "user",
  MESSAGE: "message",
  ERROR: "error",
} as const;

const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  NOT_FOUND: "Ad not found or unauthorized",
  DELETE_NOT_FOUND: "Ad not found",
  UPDATE_FAILED: "Failed to update ad",
  DELETE_FAILED: "Failed to delete ad",
  INTERNAL_ERROR: "Internal server error",
} as const;

const SUCCESS_MESSAGES = {
  DELETED: "Ad deleted successfully",
} as const;

const AD_TYPES = {
  BOAT: "boat",
  CAR: "car",
  MARKETPLACE: "marketplace",
  REAL_ESTATE: "realEstate",
  MOTORCYCLE: "motorcycle",
  FARM_EQUIPMENT: "farmequipment",
} as const;

const COMMON_FIELDS = [
  FIELD_NAMES.TITLE,
  FIELD_NAMES.DESCRIPTION,
  FIELD_NAMES.PRICE,
] as const;

const MODELS = [
  { name: AD_TYPES.BOAT, model: prisma.boat },
  { name: AD_TYPES.CAR, model: prisma.car },
  { name: AD_TYPES.MARKETPLACE, model: prisma.marketplace },
  { name: AD_TYPES.REAL_ESTATE, model: prisma.realEstate },
  { name: AD_TYPES.MOTORCYCLE, model: prisma.motorcycle },
  { name: AD_TYPES.FARM_EQUIPMENT, model: prisma.farmequipment },
  { name: "job", model: prisma.job },
] as const;

const CACHE_KEYS = {
  USER_ADS: (userId: string) => `user:ads:${userId}`,
} as const;

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const getSelectFields = (name: string) => ({
  select: {
    id: true,
    title: true,
    description: true,
    ...(name === "job" ? { salary: true } : { price: true }),
    images: true,
    maGaday: true,
    isPaid: true,
  },
});

const addMetadata = (ad: any, type: string) => {
  const { salary, ...rest } = ad;
  return {
    ...rest,
    ...(salary !== undefined ? { price: salary } : {}),
    [FIELD_NAMES.TYPE]: type,
    [FIELD_NAMES.IS_PAID]: ad.isPaid ?? false,
  };
};

const findAdInModels = async (id: string, userId: string) => {
  const results = await Promise.all(
    MODELS.map(async ({ name, model }) => {
      const ad = await (model as any).findFirst({
        where: { id, userId },
        select: { id: true },
      });
      return ad ? { name, model } : null;
    }),
  );
  return results.find(Boolean) ?? null;
};

const findAdInModelsByIdOnly = async (id: string) => {
  const results = await Promise.all(
    MODELS.map(async ({ name, model }) => {
      const ad = await (model as any).findFirst({
        where: { id },
        select: { id: true, userId: true },
      });
      return ad ? { name, model, ownerId: ad.userId as string } : null;
    }),
  );
  return results.find(Boolean) ?? null;
};

export const getAdById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });

    const { id } = req.params;
    const results = await Promise.all(
      MODELS.map(async ({ name, model }) => {
        const ad = await (model as any).findFirst({
          where: { id, userId },
          ...getSelectFields(name),
        });
        return ad ? addMetadata(ad, name) : null;
      }),
    );
    const found = results.find(Boolean);
    if (!found)
      return res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND });

    res.status(200).json(found);
  } catch {
    res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const getAds = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId)
      return res
        .status(401)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UNAUTHORIZED });

    const cacheKey = CACHE_KEYS.USER_ADS(userId);
    const ads = await cacheManager.withCache(
      cacheKey,
      async () => {
        const results = await Promise.all(
          MODELS.map(({ name, model }) =>
            (model as any)
              .findMany({
                where: { userId },
                ...getSelectFields(name),
                take: 100,
              })
              .then((rows: any[]) =>
                rows.map((r: any) => addMetadata(r, name)),
              ),
          ),
        );
        return results.flat();
      },
      CACHE_TTL.USER,
    );

    res.status(200).json(ads);
  } catch (err) {
    res
      .status(500)
      .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};

export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { maGaday, ...updateData } = req.body;
    const userId = getUserId(req);

    if (!userId)
      return res
        .status(401)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UNAUTHORIZED });

    const foundModel = await findAdInModels(id, userId);
    if (!foundModel) {
      return res
        .status(404)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.NOT_FOUND });
    }

    const dataToUpdate: Record<string, any> = {
      [FIELD_NAMES.MA_GADAY]: maGaday ?? false,
      [FIELD_NAMES.UPDATED_AT]: new Date(),
    };

    COMMON_FIELDS.forEach((field) => {
      if (updateData[field] !== undefined) {
        const mappedField =
          field === FIELD_NAMES.PRICE && foundModel.name === "job"
            ? "salary"
            : field;
        dataToUpdate[mappedField] = updateData[field];
      }
    });

    const updatedAd = await (foundModel.model as any).update({
      where: { [FIELD_NAMES.ID]: id },
      data: dataToUpdate,
      ...getSelectFields(foundModel.name),
    });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_ADS(userId)),
      cacheManager.deletePattern(`${foundModel.name}:*`),
    ]);

    res.status(200).json({
      ...updatedAd,
      [FIELD_NAMES.TYPE]: foundModel.name,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UPDATE_FAILED,
      [FIELD_NAMES.ERROR]: error.message,
    });
  }
};

export const patchAd = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = getUserId(req);

    if (!userId)
      return res.status(401).json({ message: ERROR_MESSAGES.UNAUTHORIZED });

    const foundModel = await findAdInModelsByIdOnly(id);
    if (!foundModel)
      return res.status(404).json({ message: ERROR_MESSAGES.NOT_FOUND });

    const { isPaid, planId, paymentRef, amount, paymentMethod } = req.body;
    const data: Record<string, any> = { updatedAt: new Date() };
    if (isPaid !== undefined) data.isPaid = Boolean(isPaid);
    if (planId) {
      const planExists = await prisma.subPlan.findUnique({
        where: { id: planId },
        select: { id: true },
      });
      if (planExists) data.planId = planId;
    }

    const updated = await (foundModel.model as any).update({
      where: { id },
      data,
      select: { id: true, isPaid: true, planId: true },
    });

    if (Boolean(isPaid)) {
      const adFkField: Record<string, string> = {
        boat: "boatId",
        car: "carId",
        marketplace: "marketplaceId",
        realEstate: "realEstateId",
        motorcycle: "motorcycleId",
        farmequipment: "farmequipmentId",
        job: "jobId",
      };
      const fkField = adFkField[foundModel.name];
      await prisma.payment.create({
        data: {
          userId,
          transactionId: paymentRef || undefined,
          paymentMethod: paymentMethod || "mobile",
          totalAmount: Number(amount) || 0,
          status: "COMPLETED",
          paidAt: new Date(),
          ...(fkField ? { [fkField]: id } : {}),
        },
      });
    }

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_ADS(userId)),
      cacheManager.deletePattern(`${foundModel.name}:*`),
    ]);

    return res.status(200).json(updated);
  } catch (err) {
    const error = err as Error;
    return res
      .status(500)
      .json({ message: ERROR_MESSAGES.UPDATE_FAILED, error: error.message });
  }
};

export const deleteAd = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = getUserId(req);

    if (!userId)
      return res
        .status(401)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.UNAUTHORIZED });

    const foundModel = await findAdInModels(id, userId);
    if (!foundModel) {
      return res
        .status(404)
        .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.DELETE_NOT_FOUND });
    }

    await (foundModel.model as any).delete({ where: { id } });

    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_ADS(userId)),
      cacheManager.deletePattern(`${foundModel.name}:*`),
    ]);

    res.status(200).json({ [FIELD_NAMES.MESSAGE]: SUCCESS_MESSAGES.DELETED });
  } catch (err) {
    res
      .status(500)
      .json({ [FIELD_NAMES.MESSAGE]: ERROR_MESSAGES.DELETE_FAILED });
  }
};
