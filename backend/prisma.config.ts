import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const envFile = process.env.NODE_ENV === "production" ? "../.env.production" : "../.env.local";
dotenv.config({ path: envFile });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./src/prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
