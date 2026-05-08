import http from "node:http";
import process from "node:process";
import chalk from "chalk";
import cron from "node-cron";

import app from "./app.js";
import prisma from "./core/utils/db.js";
import { seedDatabase } from "./prisma/seed.ts";
import { socketServer } from "./services/sockets/socketServer.js";
import setupGracefulShutdown from "./core/utils/gracefulShutdown.js";
import redisServer from "./services/redis/redisServer.ts";
import { runBackup } from "./services/backup/dbBackup.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await redisServer.start();
    const pub = redisServer.getClient();
    const sub = pub.duplicate();
    await sub.connect();
    socketServer(server, pub, sub);
  } catch (err) {
    console.error(chalk.yellow("[Redis] unavailable — sockets disabled:"), err);
  }

  server.listen(Number(process.env.PORT) || 8080, "::", () => {
    console.log(
      chalk.green(`Server PID ${process.pid} ready on port ${process.env.PORT || 8080}`),
    );
  });

  prisma.$connect()
    .then(async () => {
      console.log(chalk.green("DB connected"));
      try {
        await seedDatabase();
      } catch (err) {
        console.error(chalk.yellow("[Seed] failed:"), err);
      }
    })
    .catch((err: unknown) =>
      console.error(chalk.yellow("[DB] connect failed — will retry:"), err),
    );

  setupGracefulShutdown({ server, prisma, redisServer });

  cron.schedule("0 2 */3 * *", runBackup, { timezone: "UTC" });

  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      try { await prisma.$connect(); } catch {}
    }
  }, 60_000);
};

startServer().catch((err) => {
  console.error(chalk.red("Fatal startup error:"), err);
});
