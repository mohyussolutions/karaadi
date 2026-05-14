import { defineConfig } from "prisma/config";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  schema: "src/prisma",
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pg = await import("pg");
      const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL });
      return new PrismaPg(pool);
    },
  },
});
