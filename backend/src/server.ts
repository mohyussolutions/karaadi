import * as http from "http";
import app from "./app.js";
import redisServer from "./services/redisserver/redisServer.js";
import prisma from "./core/utils/db.js";
import chalk from "chalk";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await redisServer.start();
    const status = await redisServer.getStatus();

    if (status.isConnected) {
      console.log(chalk.green(` Redis Ready | Usage: ${status.memoryUsage}`));
    }

    await prisma.$connect();
    console.log(chalk.green(" Database connected"));

    server.listen(process.env.PORT || 8080, () => {
      console.log(
        chalk.blue(` Server listening on port ${process.env.PORT || 8080}`),
      );
    });
  } catch (e) {
    console.error(chalk.red("Startup failed:"), e);
    process.exit(1);
  }
};

startServer();
