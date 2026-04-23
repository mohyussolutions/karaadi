import "dotenv/config";
import http from "node:http";
import process from "node:process";
import chalk from "chalk";

import app from "./app.js";
import redisServer from "./services/redisserver/redisServer.js";
import prisma from "./core/utils/db.js";
import { socketServer } from "./services/sockets/socketServer.js";
import setupGracefulShutdown from "./core/utils/gracefulShutdown.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await Promise.all([redisServer.start(), prisma.$connect()]);

    const pub = redisServer.getClient();
    const sub = pub.duplicate();
    await sub.connect();

    socketServer(server, pub, sub);

    server.listen(Number(process.env.PORT) || 8080, "::", () => {
      console.log(
        chalk.green(
          `Server PID ${process.pid} ready on port ${process.env.PORT}`,
        ),
      );
    });

    setupGracefulShutdown({ server, prisma, redisServer });
  } catch (err) {
    console.error(chalk.red("Startup failed:"), err);
    process.exit(1);
  }
};

startServer();
