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
  try {
    await prisma.$connect();

    if (process.env.REDIS_URL) {
      await redisServer.start();
      const pub = redisServer.getClient();
      const sub = pub.duplicate();
      await sub.connect();
      socketServer(server, pub, sub);
    } else {
      console.warn(chalk.yellow("REDIS_URL not set — sockets running without Redis adapter"));
      socketServer(server);
    }

    server.listen(Number(process.env.PORT) || 8080, "::", () => {
      console.log(
        chalk.green(
          `Server PID ${process.pid} ready on port ${process.env.PORT}`,
        ),
      );
    });

    setupGracefulShutdown({ server, prisma, redisServer });

    cron.schedule("0 2 */3 * *", runBackup, { timezone: "UTC" });

    setInterval(async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch (e) {
        console.warn(
          chalk.yellow("[Keepalive] DB ping failed — reconnecting…"),
        );
        try {
          await prisma.$connect();
        } catch {}
      }
    }, 60_000);
  } catch (err) {
    console.error(chalk.red("Startup failed:"), err);
    process.exit(1);
  }
};

startServer();
