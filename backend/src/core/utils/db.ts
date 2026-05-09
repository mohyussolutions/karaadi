import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Load environment variables from common locations when running locally
const tryLoadEnv = () => {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  const backendRoot = path.resolve(__dirname, "../../../");
  dotenv.config({ path: path.join(backendRoot, ".env"), override: false });
  dotenv.config({
    path: path.join(backendRoot, ".env.local"),
    override: false,
  });
  dotenv.config({
    path: path.join(backendRoot, "..", ".env.local"),
    override: false,
  });
};

tryLoadEnv();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // try once more then fail with helpful guidance
  tryLoadEnv();
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Create backend/.env with DATABASE_URL=postgresql://... or export DATABASE_URL in your shell.",
  );
}

declare global {
  var prisma: PrismaClient | undefined;
}

const pool = new pg.Pool({
  connectionString,
  max: parseInt(process.env.PG_POOL_MAX || "20"),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  maxUses: 7500,
});

const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected!");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDb = async () => {
  try {
    await prisma.$disconnect();
    await pool.end();
    console.log("DB disconnected!");
  } catch (err) {
    console.error("DB disconnection failed:", err);
  }
};

export default prisma;
