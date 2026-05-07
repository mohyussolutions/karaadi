import { Request, Response } from "express";
import prisma from "../core/utils/db.ts";

const MODEL_MAP: Record<string, any> = {
  cars: prisma.car,
  car: prisma.car,
  boats: prisma.boat,
  boat: prisma.boat,
  motorcycles: prisma.motorcycle,
  motorcycle: prisma.motorcycle,
  "real-estate": (prisma as any).realEstate,
  realestate: (prisma as any).realEstate,
  traktor: (prisma as any).farmequipment,
  farmequipment: (prisma as any).farmequipment,
  marketplace: (prisma as any).marketplace,
  jobs: (prisma as any).job,
  job: (prisma as any).job,
};

export const serveImage = async (req: Request, res: Response) => {
  const { table, id, index } = req.params;
  const tableKey = (Array.isArray(table) ? table[0] : table).toLowerCase();
  const model = MODEL_MAP[tableKey];
  if (!model) return res.status(404).end();

  try {
    const item = await model.findUnique({ where: { id }, select: { images: true } });
    const all = (item?.images as string[] | null)?.filter(
      (img) => img && img.startsWith("data:"),
    ) ?? [];
    const idx = index !== undefined ? Number(index) : 0;
    const dataUrl = all[idx];
    if (!dataUrl) return res.status(404).end();

    const commaIdx = dataUrl.indexOf(",");
    const mimeType = dataUrl.slice(0, commaIdx).match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const buffer = Buffer.from(dataUrl.slice(commaIdx + 1), "base64");

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.send(buffer);
  } catch {
    res.status(500).end();
  }
};
