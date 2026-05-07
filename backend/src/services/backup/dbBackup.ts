import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "src/core/utils/db.ts";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.S3_BUCKET_NAME;

async function collectAll() {
  const [
    users, marketplace, realEstate, boats, cars,
    motorcycles, farmequipment, jobs, businesses,
  ] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, username: true, phone: true, isAdmin: true, isManager: true, isSupport: true, createdAt: true } }),
    prisma.marketplace.findMany(),
    prisma.realEstate.findMany(),
    prisma.boat.findMany(),
    prisma.car.findMany(),
    prisma.motorcycle.findMany(),
    prisma.farmequipment.findMany(),
    prisma.job.findMany(),
    prisma.business.findMany(),
  ]);
  return { users, marketplace, realEstate, boats, cars, motorcycles, farmequipment, jobs, businesses };
}

export async function runBackup(): Promise<void> {
  if (!BUCKET) {
    console.error("[BACKUP] S3_BUCKET_NAME not set, skipping");
    return;
  }

  try {
    const data = await collectAll();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const key = `backups/db-${timestamp}.json`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
      }),
    );

    console.log(`[BACKUP] Uploaded ${key} to s3://${BUCKET}`);
  } catch (err: any) {
    console.error("[BACKUP] Failed:", err.message);
  }
}
