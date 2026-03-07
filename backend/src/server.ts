import * as http from "http";
import cluster from "node:cluster";
import os from "node:os";
import process from "node:process";
import chalk from "chalk";
import app from "./app.js";
import redisServer from "./services/redisserver/redisServer.js";
import prisma from "./core/utils/db.js";
import { socketServer } from "./services/sockets/socketServer.ts";

const numCPUs =
  process.env.NODE_ENV === "production"
    ? os.availableParallelism?.() || os.cpus().length
    : 2;

if (cluster.isPrimary) {
  console.log(chalk.bold.magenta(`Primary System [PID: ${process.pid}]`));
  console.log(chalk.cyan(`Targeting ${numCPUs} Workers`));

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      chalk.red(
        `Worker ${worker.process.pid} died [Code: ${code}] [Signal: ${signal}]`,
      ),
    );
    cluster.fork();
  });
} else {
  const server = http.createServer(app);

  const startWorker = async () => {
    try {
      await redisServer.start();
      const status = await redisServer.getStatus();

      const pubClient = redisServer.getClient();
      const subClient = pubClient.duplicate();

      await subClient.connect();

      socketServer(server, pubClient, subClient);

      await prisma.$connect();

      const PORT = process.env.PORT || 8080;
      server.listen(PORT, () => {
        console.log(
          chalk.green(
            `Worker ${process.pid} | Port: ${PORT} | Redis: ${status.isConnected ? "Online" : "Offline"}`,
          ),
        );
      });
    } catch (e) {
      console.error(chalk.red(`Worker ${process.pid} failed:`), e);
      process.exit(1);
    }
  };

  startWorker();
}
