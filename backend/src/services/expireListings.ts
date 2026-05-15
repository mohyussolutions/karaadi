import prisma from "src/core/utils/db.ts";

const MODELS = [
  prisma.marketplace,
  prisma.car,
  prisma.boat,
  prisma.motorcycle,
  prisma.realEstate,
  prisma.farmequipment,
  prisma.job,
] as const;

export async function expireListings(): Promise<void> {
  const now = new Date();
  await Promise.all(
    MODELS.map((model) =>
      (model as any).updateMany({
        where: { isPaid: true, expiryDate: { lt: now } },
        data: { isPaid: false },
      }).catch(() => {}),
    ),
  );
}
