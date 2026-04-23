import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import cacheManager from "src/services/redisserver/cacheManager.ts";
import { CACHE_TTL } from "src/config/config.constants.ts";

const CACHE_KEY = "business-plans:all";

export const getAllBusinessPlans = async (_req: Request, res: Response) => {
  try {
    const plans = await cacheManager.withCache(
      CACHE_KEY,
      () =>
        (prisma as any).businessPlan.findMany({ orderBy: { price: "asc" } }),
      CACHE_TTL.LIST,
    );
    res.json({ success: true, plans });
  } catch {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

export const getBusinessPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await (prisma as any).businessPlan.findUnique({
      where: { id: req.params.id },
    });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json({ success: true, plan });
  } catch {
    res.status(500).json({ error: "Failed to fetch plan" });
  }
};

export const createBusinessPlan = async (req: Request, res: Response) => {
  try {
    const { name, price, durationDays, maxListings, categories, features } =
      req.body;
    if (!name || price === undefined || !durationDays || !maxListings) {
      return res
        .status(400)
        .json({
          error: "name, price, durationDays and maxListings are required",
        });
    }

    const plan = await (prisma as any).businessPlan.create({
      data: {
        name,
        price: Number(price),
        durationDays: Number(durationDays),
        maxListings: Number(maxListings),
        categories: categories ?? [],
        features: features ?? [],
        isActive: true,
      },
    });

    await cacheManager.delete(CACHE_KEY).catch(() => {});
    res.status(201).json({ success: true, plan });
  } catch {
    res.status(500).json({ error: "Failed to create plan" });
  }
};

export const updateBusinessPlan = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      durationDays,
      maxListings,
      categories,
      features,
      isActive,
    } = req.body;

    const plan = await (prisma as any).businessPlan.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: Number(price) }),
        ...(durationDays !== undefined && {
          durationDays: Number(durationDays),
        }),
        ...(maxListings !== undefined && { maxListings: Number(maxListings) }),
        ...(categories !== undefined && { categories }),
        ...(features !== undefined && { features }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    await cacheManager.delete(CACHE_KEY).catch(() => {});
    res.json({ success: true, plan });
  } catch {
    res.status(500).json({ error: "Failed to update plan" });
  }
};

export const deleteBusinessPlan = async (req: Request, res: Response) => {
  try {
    await (prisma as any).businessPlan.delete({ where: { id: req.params.id } });
    await cacheManager.delete(CACHE_KEY).catch(() => {});
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
