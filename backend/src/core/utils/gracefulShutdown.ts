import chalk from "chalk";
import type * as http from "http";

type SetupParams = {
  server: http.Server | null;
  prisma: { $disconnect: () => Promise<void> };
  redisServer: { stop: () => Promise<void> };
};

export default function setupGracefulShutdown({
  server,
  prisma,
  redisServer,
}: SetupParams) {
  const gracefulShutdown = async (signal?: string) => {
    try {
      console.log(
        chalk.yellow(
          `Shutting down process ${process.pid}${signal ? ` due to ${signal}` : ""}`,
        ),
      );
      if (server) {
        server.close(() => {
          console.log(chalk.yellow("HTTP server closed"));
        });
      }
    } catch (e) {
      console.error("Error closing server", e);
    }

    try {
      await prisma.$disconnect();
      console.log(chalk.yellow("Prisma disconnected"));
    } catch (e) {}

    try {
      await redisServer.stop();
    } catch (e) {}

    process.exit(0);
  };

  process.on("unhandledRejection", (reason) => {
    console.error(chalk.red("Unhandled Rejection:"), reason);
  });

  process.on("uncaughtException", (err) => {
    console.error(chalk.red("Uncaught Exception:"), err);
    process.exit(1);
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}
