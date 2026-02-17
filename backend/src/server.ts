import * as http from "http";
import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
import { socketServer } from "./services/sockets/socketServer.js";
import redisServer from "./services/redisserver/redisServer.js";
import prisma from "./core/utils/db.js";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const PORT = Number(process.env.PORT || 8080);
const server = http.createServer(app);
socketServer(server);

const startServer = async () => {
  try {
    await redisServer.start();
    const redisStatus = await redisServer.getStatus();
    if (redisStatus.isConnected) {
      console.log(chalk.green("✓ Redis connected"));
    } else {
      console.error(chalk.red("✗ Redis is not connected"));
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
