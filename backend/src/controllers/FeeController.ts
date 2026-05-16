import { Request, Response } from "express";
import prisma from "src/core/utils/db.ts";
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
  SYSTEM_CONFIG_NUMERIC_FIELDS,
  BP_DURATIONS,
  BP_NAMES,
  FEE_TAKE,
} from "src/config/constants/fee.constants.ts";

type RawBody = Record<string, unknown>;

function pickKeys(keys: readonly string[], raw: RawBody): RawBody {
  return Object.fromEntries(
    keys
      .filter((k) => k in raw && raw[k] !== undefined && raw[k] !== null)
      .map((k) => [k, raw[k]]),
  );
}

function logChange(
  feeConfigId: string,
  changedBy: string | undefined,
  reason: string | undefined,
  defaultReason: string,
  previous: RawBody,
  next: RawBody,
) {
  if (!changedBy) return Promise.resolve();
  return prisma.feeChangeLog.create({
    data: {
      feeConfigId,
      changedBy,
      reason: reason || defaultReason,
      previousValues: JSON.parse(JSON.stringify(previous)),
      newValues: JSON.parse(JSON.stringify(next)),
      changes: JSON.parse(JSON.stringify(next)),
    },
  });
}

function extractId(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

export const getAllFeeConfigs = async (_req: Request, res: Response) => {
  try {
    const [marketplace, realEstate, cars, motorcycles, boats, equipment, subPlans, system, bpRaw] =
      await Promise.all([
        prisma.marketplaceFee.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.realEstateFee.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.carFee.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.motorcycleFee.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.boatFee.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.equipmentFeeConfig.findMany({ orderBy: { updatedAt: "desc" }, take: FEE_TAKE }),
        prisma.subPlan.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.systemConfig.findFirst(),
        prisma.businessPlan.findMany({
          where: { durationDays: { in: [BP_DURATIONS.BASIC, BP_DURATIONS.STANDARD, BP_DURATIONS.PREMIUM] } },
          orderBy: { durationDays: "asc" },
        }),
      ]);
    const p30 = bpRaw.find((p) => p.durationDays === BP_DURATIONS.BASIC);
    const p60 = bpRaw.find((p) => p.durationDays === BP_DURATIONS.STANDARD);
    const p90 = bpRaw.find((p) => p.durationDays === BP_DURATIONS.PREMIUM);
    res.json({
      marketplace,
      realEstate,
      cars,
      motorcycles,
      boats,
      equipment,
      subPlans,
      system: system || {},
      businessPlans: [{ id: "bp-fee-config", bp30: p30?.price ?? 0, bp60: p60?.price ?? 0, bp90: p90?.price ?? 0, isActive: true }],
    });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !MARKETPLACE_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing fee fields" });
    const result = await prisma.marketplaceFee.create({ data: body as Parameters<typeof prisma.marketplaceFee.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMarketplaceFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.marketplaceFee.findMany({
      select: { id: true, art: true, electronics: true, animal: true, sports: true, furniture: true, fashion: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getMarketplaceFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.marketplaceFee.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(MARKETPLACE_FEE_KEYS, rawData);
    if (!Object.keys(data).length) return res.status(400).json({ error: "Missing fee fields" });
    const existing = await prisma.marketplaceFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.marketplaceFee.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Marketplace update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMarketplaceFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.marketplaceFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createRealEstateFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !REAL_ESTATE_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing fee fields" });
    const result = await prisma.realEstateFee.create({ data: body as Parameters<typeof prisma.realEstateFee.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllRealEstateFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.realEstateFee.findMany({
      select: { id: true, rent: true, sale: true, land: true, farm: true, business: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getRealEstateFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.realEstateFee.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(REAL_ESTATE_FEE_KEYS, rawData);
    if (!Object.keys(data).length) return res.status(400).json({ error: "Missing fee fields" });
    const existing = await prisma.realEstateFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.realEstateFee.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Real Estate update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteRealEstateFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.realEstateFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllCarFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.carFee.findMany({
      select: { id: true, carSale: true, carRent: true, trailer: true, carParts: true, truck: true, electricCar: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getCarFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.carFee.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createCarFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !CAR_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing car fee fields" });
    const result = await prisma.carFee.create({ data: body as Parameters<typeof prisma.carFee.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateCarFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(CAR_FEE_KEYS, rawData);
    if (!Object.keys(data).length) return res.status(400).json({ error: "Missing car fee fields" });
    const existing = await prisma.carFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.carFee.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Car fee update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteCarFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.carFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllMotorcycleFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.motorcycleFee.findMany({
      select: { id: true, motoSale: true, motoRent: true, motoParts: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getMotorcycleFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.motorcycleFee.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !MOTORCYCLE_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing motorcycle fee fields" });
    const result = await prisma.motorcycleFee.create({ data: body as Parameters<typeof prisma.motorcycleFee.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(MOTORCYCLE_FEE_KEYS, rawData);
    if (!Object.keys(data).length) return res.status(400).json({ error: "Missing motorcycle fee fields" });
    const existing = await prisma.motorcycleFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.motorcycleFee.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Motorcycle fee update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteMotorcycleFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.motorcycleFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createBoatFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !BOAT_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing fee fields" });
    const result = await prisma.boatFee.create({ data: body as Parameters<typeof prisma.boatFee.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllBoatFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.boatFee.findMany({
      select: { id: true, boatSale: true, boatRent: true, boatEngine: true, boatParts: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getBoatFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.boatFee.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateBoatFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(BOAT_FEE_KEYS, rawData);
    if (!Object.keys(data).length) return res.status(400).json({ error: "Missing fee fields" });
    const existing = await prisma.boatFee.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.boatFee.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Boat update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteBoatFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.boatFee.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createEquipmentFee = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !EQUIPMENT_FEE_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing fee fields" });
    const result = await prisma.equipmentFeeConfig.create({ data: body as Parameters<typeof prisma.equipmentFeeConfig.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllEquipmentFees = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.equipmentFeeConfig.findMany({
      select: { id: true, tractorSale: true, agriTool: true, harvester: true, other: true, isActive: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: FEE_TAKE,
    });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getEquipmentFeeById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.equipmentFeeConfig.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(EQUIPMENT_FEE_KEYS, rawData);
    const existing = await prisma.equipmentFeeConfig.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.equipmentFeeConfig.update({ where: { id }, data });
    await logChange(id, adminId, reason, "Equipment update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteEquipmentFee = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
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

export const getSystemConfig = async (_req: Request, res: Response) => {
  try {
    const result = await prisma.systemConfig.findFirst({
      select: { id: true, taxRate: true, platformFee: true, waafiFee: true, currency: true, updatedAt: true },
    });
    res.json(result || {});
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data: Record<string, string | number> = {};
    for (const k of SYSTEM_CONFIG_KEYS) {
      const value = rawData[k];
      if (value !== undefined && value !== null) {
        data[k] = SYSTEM_CONFIG_NUMERIC_FIELDS.has(k) ? Number(value) : String(value);
      }
    }
    const existing = await prisma.systemConfig.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = await prisma.systemConfig.update({ where: { id }, data });
    await logChange(id, adminId, reason, "System update", existing, data);
    res.json(updated);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteSystemConfig = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.systemConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createSubPlan = async (req: Request, res: Response) => {
  try {
    const body = req.body as RawBody;
    if (!body || !SUB_PLAN_KEYS.some((k) => k in body))
      return res.status(400).json({ error: "Missing subscription plan fields" });
    const result = await prisma.subPlan.create({ data: body as Parameters<typeof prisma.subPlan.create>[0]["data"] });
    res.status(201).json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getAllSubPlans = async (_req: Request, res: Response) => {
  try {
    const results = await prisma.subPlan.findMany({ orderBy: { createdAt: "desc" } });
    res.json(results);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const getSubPlanById = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const result = await prisma.subPlan.findUnique({ where: { id } });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateSubPlan = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    const { adminId, reason, ...rawData } = req.body as RawBody & { adminId?: string; reason?: string };
    const data = pickKeys(SUB_PLAN_KEYS, rawData);
    if (!Object.keys(data).length)
      return res.status(400).json({ error: "Missing subscription plan fields" });
    const existing = await prisma.subPlan.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    const result = await prisma.subPlan.update({ where: { id }, data });
    await logChange(id, adminId, reason, "SubPlan update", existing, data);
    res.json(result);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const deleteSubPlan = async (req: Request, res: Response) => {
  try {
    const id = extractId(req.params.id);
    await prisma.subPlan.delete({ where: { id } });
    res.json({ success: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

async function upsertStandardPlan(name: string, durationDays: number, price: number) {
  const existing = await prisma.businessPlan.findFirst({ where: { durationDays } });
  if (existing) {
    return prisma.businessPlan.update({ where: { id: existing.id }, data: { price } });
  }
  return prisma.businessPlan.create({
    data: { name, price, durationDays, maxListings: 10, categories: [], features: [], isActive: true },
  });
}

export const getBusinessPlanFees = async (_req: Request, res: Response) => {
  try {
    const plans = await prisma.businessPlan.findMany({
      where: { durationDays: { in: [BP_DURATIONS.BASIC, BP_DURATIONS.STANDARD, BP_DURATIONS.PREMIUM] } },
      orderBy: { durationDays: "asc" },
    });
    const p30 = plans.find((p) => p.durationDays === BP_DURATIONS.BASIC);
    const p60 = plans.find((p) => p.durationDays === BP_DURATIONS.STANDARD);
    const p90 = plans.find((p) => p.durationDays === BP_DURATIONS.PREMIUM);
    res.json([{ id: "bp-fee-config", bp30: p30?.price ?? 0, bp60: p60?.price ?? 0, bp90: p90?.price ?? 0, isActive: true }]);
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const createBusinessPlanFees = async (req: Request, res: Response) => {
  try {
    const { bp30 = 0, bp60 = 0, bp90 = 0 } = req.body as { bp30?: number; bp60?: number; bp90?: number };
    await Promise.all([
      upsertStandardPlan(BP_NAMES.BASIC, BP_DURATIONS.BASIC, Number(bp30)),
      upsertStandardPlan(BP_NAMES.STANDARD, BP_DURATIONS.STANDARD, Number(bp60)),
      upsertStandardPlan(BP_NAMES.PREMIUM, BP_DURATIONS.PREMIUM, Number(bp90)),
    ]);
    cacheManager.delete(CACHE_KEYS.BUSINESS_PLANS_ALL).catch(() => {});
    res.status(201).json({ id: "bp-fee-config", bp30, bp60, bp90, isActive: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};

export const updateBusinessPlanFees = async (req: Request, res: Response) => {
  try {
    const { bp30, bp60, bp90 } = req.body as { bp30?: number; bp60?: number; bp90?: number };
    await Promise.all([
      ...(bp30 !== undefined ? [upsertStandardPlan(BP_NAMES.BASIC, BP_DURATIONS.BASIC, Number(bp30))] : []),
      ...(bp60 !== undefined ? [upsertStandardPlan(BP_NAMES.STANDARD, BP_DURATIONS.STANDARD, Number(bp60))] : []),
      ...(bp90 !== undefined ? [upsertStandardPlan(BP_NAMES.PREMIUM, BP_DURATIONS.PREMIUM, Number(bp90))] : []),
    ]);
    cacheManager.delete(CACHE_KEYS.BUSINESS_PLANS_ALL).catch(() => {});
    res.json({ id: "bp-fee-config", bp30, bp60, bp90, isActive: true });
  } catch (e: unknown) {
    res.status(500).json({ error: (e as Error).message });
  }
};
