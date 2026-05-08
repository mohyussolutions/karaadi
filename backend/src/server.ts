import http from "node:http";
import process from "node:process";
import chalk from "chalk";
import cron from "node-cron";

import app from "./app.js";
import prisma from "./core/utils/db.js";
import { socketServer } from "./services/sockets/socketServer.js";
import setupGracefulShutdown from "./core/utils/gracefulShutdown.js";
import redisServer from "./services/redis/redisServer.ts";
import { runBackup } from "./services/backup/dbBackup.js";

const server = http.createServer(app);

const startServer = async () => {
  await redisServer.start().catch((err: unknown) => {
    console.error(chalk.yellow("[Redis] failed to connect:"), err);
  });

  const pub = redisServer.getClient();
  const sub = pub.duplicate();
  await sub.connect().catch((err: unknown) => {
    console.error(chalk.yellow("[Redis] sub connect failed:"), err);
  });

  socketServer(server, pub, sub);

  server.listen(Number(process.env.PORT) || 8080, "::", () => {
    console.log(
      chalk.green(`Server PID ${process.pid} ready on port ${process.env.PORT}`),
    );
  });

  prisma.$connect()
    .then(() => console.log(chalk.green("DB connected")))
    .catch((err: unknown) => {
      console.error(chalk.yellow("[DB] initial connect failed — will retry:"), err);
    });

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

startServer();
