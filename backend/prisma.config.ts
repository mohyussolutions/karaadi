import dotenv from "dotenv";
dotenv.config({ debug: false });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./src/prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
