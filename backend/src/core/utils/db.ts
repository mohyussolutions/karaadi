import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

export default prisma;

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
    await pool.end();
    console.log("DB disconnected!");
  } catch (err) {
    console.error("DB disconnection failed:", err);
    process.exit(1);
  }
};
