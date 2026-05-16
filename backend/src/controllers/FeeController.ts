import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
import type { Prisma } from "@prisma/client";
import cacheManager from "src/services/redis/cacheManager.ts";
import { CACHE_KEYS } from "src/config/config.constants.ts";
import {
  MARKETPLACE_FEE_KEYS,
  REAL_ESTATE_FEE_KEYS,
  CAR_FEE_KEYS,
  MOTORCYCLE_FEE_KEYS,
  BOAT_FEE_KEYS,
  EQUIPMENT_FEE_KEYS,
  SUB_PLAN_KEYS,
  SYSTEM_CONFIG_KEYS,
} from "src/config/constants/fee.constants.ts";

export const getAllFeeConfigs = async (_req: Request, res: Response) => {
  try {
    const [
      marketplace,
      realEstate,
      cars,
      motorcycles,
      boats,
      equipment,
      subPlans,
      system,
      bpRaw,
    ] = await Promise.all([
      prisma.marketplaceFee.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.realEstateFee.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.carFee.findMany({ orderBy: { updatedAt: "desc" }, take: 20 }),
      prisma.motorcycleFee.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.boatFee.findMany({ orderBy: { updatedAt: "desc" }, take: 20 }),
      prisma.equipmentFeeConfig.findMany({
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),
      prisma.subPlan.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.systemConfig.findFirst(),
      (prisma as any).businessPlan.findMany({
        where: { durationDays: { in: [30, 60, 90] } },
        orderBy: { durationDays: "asc" },
      }),
    ]);
    const p30 = bpRaw.find((p: any) => p.durationDays === 30);
    const p60 = bpRaw.find((p: any) => p.durationDays === 60);
    const p90 = bpRaw.find((p: any) => p.durationDays === 90);
    res.json({
      marketplace,
      realEstate,
      cars,
      motorcycles,
      boats,
      equipment,
      subPlans,
      system: system || {},
      businessPlans: [
        {
          id: "bp-fee-config",
          bp30: p30?.price ?? 0,
          bp60: p60?.price ?? 0,
          bp90: p90?.price ?? 0,
          isActive: true,
        },
      ],
    });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.MarketplaceFeeCreateInput = req.body;
    if (!data || !MARKETPLACE_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.marketplaceFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMarketplaceFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.marketplaceFee.findMany({
      select: {
        id: true,
        art: true,
        electronics: true,
        animal: true,
        sports: true,
        furniture: true,
        fashion: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getMarketplaceFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.marketplaceFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.MarketplaceFeeUpdateInput = {};
    MARKETPLACE_FEE_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.marketplaceFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.marketplaceFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Marketplace update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.marketplaceFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createRealEstateFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.RealEstateFeeCreateInput = req.body;
    if (!data || !REAL_ESTATE_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.realEstateFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllRealEstateFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.realEstateFee.findMany({
      select: {
        id: true,
        rent: true,
        sale: true,
        land: true,
        farm: true,
        business: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getRealEstateFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.realEstateFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.RealEstateFeeUpdateInput = {};
    REAL_ESTATE_FEE_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.realEstateFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.realEstateFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Real Estate update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.realEstateFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllCarFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.carFee.findMany({
      select: {
        id: true,
        carSale: true,
        carRent: true,
        trailer: true,
        carParts: true,
        truck: true,
        electricCar: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getCarFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.carFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createCarFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.CarFeeCreateInput = req.body;
    if (!data || !CAR_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const result = await prisma.carFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    const filtered: Prisma.CarFeeUpdateInput = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => (CAR_FEE_KEYS as readonly string[]).includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing car fee fields" });
    }
    const existing = await prisma.carFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.carFee.update({
      where: { id },
      data: filtered,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Car fee update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(filtered)),
          changes: JSON.parse(JSON.stringify(filtered)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteCarFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.carFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMotorcycleFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.motorcycleFee.findMany({
      select: {
        id: true,
        motoSale: true,
        motoRent: true,
        motoParts: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getMotorcycleFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.motorcycleFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.MotorcycleFeeCreateInput = req.body;
    if (!data || !MOTORCYCLE_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const result = await prisma.motorcycleFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...data } = req.body;
    const filtered: Prisma.MotorcycleFeeUpdateInput = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => (MOTORCYCLE_FEE_KEYS as readonly string[]).includes(k) && v !== null && v !== undefined,
      ),
    );
    if (!Object.keys(filtered).length) {
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    }
    const existing = await prisma.motorcycleFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.motorcycleFee.update({
      where: { id },
      data: filtered,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Motorcycle fee update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(filtered)),
          changes: JSON.parse(JSON.stringify(filtered)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.motorcycleFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createBoatFee = async (req: Request, res: Response) => {
  try {
    const data: Prisma.BoatFeeCreateInput = req.body;
    if (!data || !BOAT_FEE_KEYS.some((k) => k in data)) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const result = await prisma.boatFee.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllBoatFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.boatFee.findMany({
      select: {
        id: true,
        boatSale: true,
        boatRent: true,
        boatEngine: true,
        boatParts: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getBoatFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.boatFee.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.BoatFeeUpdateInput = {};
    BOAT_FEE_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Missing fee fields" });
    }
    const existing = await prisma.boatFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.boatFee.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Boat update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteBoatFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.boatFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createEquipmentFee = async (req: Request, res: Response) => {
  try {
    const result = await prisma.equipmentFeeConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllEquipmentFees = async (req: Request, res: Response) => {
  try {
    const results = await prisma.equipmentFeeConfig.findMany({
      select: {
        id: true,
        tractorSale: true,
        agriTool: true,
        harvester: true,
        other: true,
        isActive: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getEquipmentFeeById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.equipmentFeeConfig.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.EquipmentFeeConfigUpdateInput = {};
    EQUIPMENT_FEE_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as any)[k] = rawData[k];
      }
    });
    const existing = await prisma.equipmentFeeConfig.findUnique({
      where: { id },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.equipmentFeeConfig.update({
      where: { id },
      data,
    });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Equipment update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.equipmentFeeConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.create({ data: req.body });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.findFirst({
      select: {
        id: true,
        taxRate: true,
        platformFee: true,
        waafiFee: true,
        currency: true,
        updatedAt: true,
      },
    });
    res.json(result || {});
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.SystemConfigUpdateInput = {};
    for (const k of SYSTEM_CONFIG_KEYS) {
      const value = rawData[k];
      if (value !== undefined && value !== null) {
        if (k === "currency") {
          data.currency = String(value);
        } else if (k === "taxRate") {
          data.taxRate = Number(value);
        } else if (k === "platformFee") {
          data.platformFee = Number(value);
        } else if (k === "waafiFee") {
          data.waafiFee = Number(value);
        }
      }
    }
    const existing = await prisma.systemConfig.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.systemConfig.update({ where: { id }, data });
    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "System update",
          previousValues: existing,
          newValues: JSON.parse(JSON.stringify(data)),
          changes: JSON.parse(JSON.stringify(data)),
        },
      });
    }
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.systemConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const createSubPlan = async (req: Request, res: Response) => {
  try {
    const data: Prisma.SubPlanCreateInput = req.body;
    if (!data || !SUB_PLAN_KEYS.some((k) => k in data)) {
      return res
        .status(400)
        .json({ error: "Missing subscription plan fields" });
    }
    const result = await prisma.subPlan.create({ data });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const getAllSubPlans = async (req: Request, res: Response) => {
  try {
    const results = await prisma.subPlan.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const getSubPlanById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await prisma.subPlan.findUnique({
      where: { id },
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const updateSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { adminId, reason, ...rawData } = req.body;
    const data: Prisma.SubPlanUpdateInput = {};
    SUB_PLAN_KEYS.forEach((k) => {
      if (k in rawData && rawData[k] !== undefined && rawData[k] !== null) {
        (data as Record<string, unknown>)[k] = rawData[k];
      }
    });

    if (!Object.keys(data).length) {
      return res
        .status(400)
        .json({ error: "Missing subscription plan fields" });
    }

    const existing = await prisma.subPlan.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const result = await prisma.subPlan.update({ where: { id }, data });

    if (adminId) {
      await prisma.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "SubPlan update",
          previousValues: existing as any,
          newValues: data as any,
          changes: data as any,
        },
      });
    }
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
export const deleteSubPlan = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.subPlan.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

async function upsertStandardPlan(
  name: string,
  durationDays: number,
  price: number,
) {
  const existing = await (prisma as any).businessPlan.findFirst({
    where: { durationDays },
  });
  if (existing) {
    return (prisma as any).businessPlan.update({
      where: { id: existing.id },
      data: { price },
    });
  }
  return (prisma as any).businessPlan.create({
    data: {
      name,
      price,
      durationDays,
      maxListings: 10,
      categories: [],
      features: [],
      isActive: true,
    },
  });
}

export const getBusinessPlanFees = async (_req: Request, res: Response) => {
  try {
    const plans = await (prisma as any).businessPlan.findMany({
      where: { durationDays: { in: [30, 60, 90] } },
      orderBy: { durationDays: "asc" },
    });
    const p30 = plans.find((p: any) => p.durationDays === 30);
    const p60 = plans.find((p: any) => p.durationDays === 60);
    const p90 = plans.find((p: any) => p.durationDays === 90);
    res.json([
      {
        id: "bp-fee-config",
        bp30: p30?.price ?? 0,
        bp60: p60?.price ?? 0,
        bp90: p90?.price ?? 0,
        isActive: true,
      },
    ]);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createBusinessPlanFees = async (req: Request, res: Response) => {
  try {
    const { bp30 = 0, bp60 = 0, bp90 = 0 } = req.body;
    await Promise.all([
      upsertStandardPlan("30-Day Plan", 30, Number(bp30)),
      upsertStandardPlan("60-Day Plan", 60, Number(bp60)),
      upsertStandardPlan("90-Day Plan", 90, Number(bp90)),
    ]);
    cacheManager.delete(CACHE_KEYS.BUSINESS_PLANS_ALL).catch(() => {});
    res
      .status(201)
      .json({ id: "bp-fee-config", bp30, bp60, bp90, isActive: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateBusinessPlanFees = async (req: Request, res: Response) => {
  try {
    const { bp30, bp60, bp90 } = req.body;
    await Promise.all([
      ...(bp30 !== undefined
        ? [upsertStandardPlan("30-Day Plan", 30, Number(bp30))]
        : []),
      ...(bp60 !== undefined
        ? [upsertStandardPlan("60-Day Plan", 60, Number(bp60))]
        : []),
      ...(bp90 !== undefined
        ? [upsertStandardPlan("90-Day Plan", 90, Number(bp90))]
        : []),
    ]);
    cacheManager.delete(CACHE_KEYS.BUSINESS_PLANS_ALL).catch(() => {});
    res.json({ id: "bp-fee-config", bp30, bp60, bp90, isActive: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
