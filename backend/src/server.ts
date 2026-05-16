import http from "node:http";
import process from "node:process";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import cron from "node-cron";

import app from "./app.js";
import prisma from "./core/utils/db.js";
import { socketServer } from "./services/sockets/socketServer.js";
import setupGracefulShutdown from "./core/utils/gracefulShutdown.js";
import redisServer from "./services/redis/redisServer.ts";
import { runBackup } from "./services/backup/dbBackup.js";
import { expireListings } from "./services/expireListings.js";

const execAsync = promisify(exec);
const PORT = Number(process.env.PORT) || 8080;

const server = http.createServer(app);

async function runMigrations() {
  try {
    const { stdout, stderr } = await execAsync(
      "npx prisma migrate deploy --schema ./src/prisma",
    );
    if (stdout) console.log(chalk.cyan("[migrations]"), stdout.trim());
    if (stderr) console.warn(chalk.yellow("[migrations]"), stderr.trim());
  } catch (err: unknown) {
    console.error(chalk.red("[migrations] failed:"), err);
  }
}

async function initServer() {
  await runMigrations();

  await prisma.$connect();

  const redisUrl = process.env.REDIS_URL ?? "";
  const validRedis =
    redisUrl.startsWith("redis://") || redisUrl.startsWith("rediss://");

  if (validRedis) {
    try {
      await redisServer.start();
      const pub = redisServer.getClient();
      const sub = pub.duplicate();
      await sub.connect();
      socketServer(server, pub, sub);
    } catch (redisErr: unknown) {
      const host =
        (redisErr as { socketError?: { hostname?: string }; hostname?: string })
          ?.socketError?.hostname ??
        (redisErr as { hostname?: string })?.hostname ??
        "unknown";
      console.warn(
        chalk.yellow(`Redis unavailable (${host}) — sockets without Redis adapter`),
      );
      socketServer(server);
    }
  } else {
    console.warn(chalk.yellow("No valid REDIS_URL — sockets without Redis adapter"));
    socketServer(server);
  }

  setupGracefulShutdown({ server, prisma, redisServer });

  cron.schedule("0 2 */3 * *", runBackup, { timezone: "UTC" });
  cron.schedule("0 * * * *", expireListings, { timezone: "UTC" });
  expireListings().catch(() => {});

  setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      console.warn(chalk.yellow("[keepalive] DB ping failed — reconnecting…"));
      try {
        await prisma.$connect();
      } catch {}
    }
  }, 60_000);

  console.log(chalk.green(`[server] ready — all services initialised`));
}

server.listen(PORT, "::", () => {
  console.log(chalk.green(`[server] PID ${process.pid} listening on port ${PORT}`));
  initServer().catch((err) => {
    console.error(chalk.red("[server] init failed:"), err);
    process.exit(1);
  });
});
