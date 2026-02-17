import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
let prismaInstance: PrismaClient | null = null;
let poolInstance: pg.Pool | null = null;
export const getPrismaClient = () => {
  if (!prismaInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    poolInstance = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(poolInstance);
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
};

export const prisma = getPrismaClient();
export default prisma;

export const connectDb = async () => {
  try {
    const client = getPrismaClient();
    await client.$connect();
    console.log("DB connected!");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  try {
    if (poolInstance) {
      await poolInstance.end();
      poolInstance = null;
      prismaInstance = null;
    }
    console.log("DB disconnected!");
  } catch (err) {
    console.error("DB disconnection failed:", err);
    process.exit(1);
  }
};
