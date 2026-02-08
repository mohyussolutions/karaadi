import { Request, Response } from "express";
import { FEE_KEYS } from "../../config/contstanst.ts";
import prisma from "../../core/utils/db.ts";
import { FeeConfigKeysPros } from "../../types/FeeConfig.ts";

export const createFeeConfig = async (req: Request, res: Response) => {
  try {
    const { adminId, currency = "USD", ...feeData } = req.body;
    if (!adminId) return res.status(400).json({ error: "adminId is required" });
    const numericData = {} as Record<string, number>;

    FEE_KEYS.forEach((key) => {
      const val = feeData[key as keyof typeof feeData];
      numericData[key] =
        val === "" || val === null || isNaN(Number(val)) ? 0 : Number(val);
    });

    const result = await prisma.$transaction(async (tx) => {
      await tx.feeConfig.updateMany({
        where: { currency, isActive: true },
        data: { isActive: false },
      });

      return await tx.feeConfig.create({
        data: {
          ...numericData,
          currency,
          isActive: true,
          createdBy: adminId,
        },
      });
    });

    res.status(201).json(result);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};

export const updateFeeWithLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminId, reason, ...updateData } = req.body;

    if (!adminId) return res.status(400).json({ error: "adminId is required" });

    const activeConfig = await prisma.feeConfig.findUnique({ where: { id } });
    if (!activeConfig) return res.status(404).json({ error: "Not found" });

    const existingFee = activeConfig as unknown as FeeConfigKeysPros;
    const numericData = {} as Record<string, number>;
    const changes = {} as Record<string, { from: number; to: number }>;

    FEE_KEYS.forEach((key) => {
      if (updateData[key] !== undefined) {
        const typedKey = key as keyof FeeConfigKeysPros;
        const newVal = Number(updateData[key]);
        const oldVal = Number(existingFee[typedKey]) || 0;

        if (!isNaN(newVal) && newVal !== oldVal) {
          numericData[typedKey] = newVal;
          changes[typedKey] = { from: oldVal, to: newVal };
        }
      }
    });

    if (Object.keys(changes).length === 0)
      return res.status(200).json(existingFee);

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.feeConfig.update({
        where: { id },
        data: { ...numericData, updatedBy: adminId },
      });

      await tx.feeChangeLog.create({
        data: {
          feeConfigId: id,
          changedBy: adminId,
          reason: reason || "Price update",
          previousValues: JSON.parse(JSON.stringify(existingFee)),
          newValues: JSON.parse(JSON.stringify(numericData)),
          changes: JSON.parse(JSON.stringify(changes)),
        },
      });

      return updated;
    });

    res.status(200).json(result);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};

export const calculateTotalFee = async (req: Request, res: Response) => {
  try {
    const { category, subType } = req.query;
    const activeConfig = await prisma.feeConfig.findFirst({
      where: { isActive: true },
    });

    if (!activeConfig)
      return res.status(404).json({ error: "No active config" });

    const config = activeConfig as unknown as FeeConfigKeysPros;
    const categoryStr = String(category || "");
    const subTypeStr = String(subType || "");

    let baseFee = 0;

    if (categoryStr === "subscription") {
      const subKey = subTypeStr as keyof FeeConfigKeysPros;

      baseFee =
        typeof config[subKey] === "number"
          ? (config[subKey] as number)
          : config.subStandard || 0;
    } else {
      const key = categoryStr as keyof FeeConfigKeysPros;
      baseFee = typeof config[key] === "number" ? (config[key] as number) : 0;
    }

    const taxAmount = (baseFee * (config.taxRate || 0)) / 100;
    const totalAmount =
      baseFee + taxAmount + (config.platformFee || 0) + (config.waafi || 0);

    res.json({
      baseFee,
      taxAmount,
      totalAmount,
      currency: config.currency,
      isFree: totalAmount <= 0,
    });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getActiveFee = async (req: Request, res: Response) => {
  try {
    const active = await prisma.feeConfig.findFirst({
      where: { isActive: true },
    });
    res.json(active || {});
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};

export const getFeeHistory = async (req: Request, res: Response) => {
  try {
    const history = await prisma.feeConfig.findMany({
      orderBy: { createdAt: "desc" },
      include: { feeChangeLogs: true },
    });
    res.json(history);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};

export const deleteFeeConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fee = await prisma.feeConfig.findUnique({ where: { id } });
    if (!fee) return res.status(404).json({ error: "Not found" });
    if (fee.isActive)
      return res.status(400).json({ error: "Cannot delete active" });

    await prisma.feeConfig.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
};
