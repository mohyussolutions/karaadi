import { Request, Response } from "express";
import prisma from "../../core/utils/db.ts";
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
] as const;

const CACHE_KEYS = {
  USER_ADS: (userId: string) => `user:ads:${userId}`,
} as const;

const getUserId = (req: AuthRequest): string | undefined =>
  req.user?.id || req.user?._id || req.user?.sub;

const selectAdFields = {
  select: {
    id: true,
    title: true,
    description: true,
    price: true,
    images: true,
    maGaday: true,
    isPaid: true,
  },
};

const addMetadata = (ad: any, type: string) => ({
  ...ad,
  [FIELD_NAMES.TYPE]: type,
  [FIELD_NAMES.IS_PAID]: ad.isPaid ?? false,
});

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
          ...selectAdFields,
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
                ...selectAdFields,
                take: 100,
              })
              .then((rows: any[]) =>
                rows.map((r: any) => addMetadata(r, name)),
              ),
          ),
        );
        return results.flat();
      },
      CACHE_TTL.LIST,
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
      if (updateData[field] !== undefined)
        dataToUpdate[field] = updateData[field];
    });

    const updatedAd = await (foundModel.model as any).update({
      where: { [FIELD_NAMES.ID]: id },
      data: dataToUpdate,
      ...selectAdFields,
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
