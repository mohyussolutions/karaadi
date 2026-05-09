import path from "path";
import dotenv from "dotenv";

const backendDir = path.resolve(__dirname, ".");
dotenv.config({ path: path.join(backendDir, ".env") });
dotenv.config({
  path: path.join(backendDir, "..", ".env.local"),
  override: false,
});

import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("[prisma.config] DATABASE_URL is not set in .env");
}

export default defineConfig({
  schema: "./src/prisma",
  datasource: {
    url: databaseUrl,
  },
});
