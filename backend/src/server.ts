import * as http from "http";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "app.ts";

import { socketServer } from "services/sockets/socketServer.ts";
import redisServer from "services/redisserver/redisServer.ts";
import prisma from "core/utils/db.ts";

dotenv.config();
const PORT = Number(process.env.PORT || 8080);
const server = http.createServer(app);
socketServer(server);
const startServer = async () => {
  console.log(chalk.blue("Starting server..."));

  try {
    await redisServer.start();
    const redisStatus = await redisServer.getStatus();
    if (redisStatus.isConnected) {
      console.log(chalk.green("✓ Redis connected"));
      console.log(
        chalk.cyan(`  Memory: ${redisStatus.memoryUsage.used_memory_human}`),
      );
    } else {
      console.log(chalk.yellow("⚠ Redis health check failed"));
    }
  } catch (e) {
    console.error(chalk.red("✗ Redis connection failed:"), e);
  }

  try {
    await prisma.$connect();
    console.log(chalk.green("✓ Database connected"));
  } catch (e) {
    console.error(chalk.red("✗ Database connection failed:"), e);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(chalk.green(`✓ Server running on port ${PORT}`));
    console.log(
      chalk.blue(`  Environment: ${process.env.NODE_ENV || "development"}`),
    );
  });
};

startServer();
