import chalk from "chalk";
import type * as http from "http";

type SetupParams = {
  server: http.Server | null;
  prisma: { $disconnect: () => Promise<void>; $connect: () => Promise<void> };
  redisServer: { stop: () => Promise<void> };
};

export default function setupGracefulShutdown({
  server,
  prisma,
  redisServer,
}: SetupParams) {
  let isShuttingDown = false;

  const gracefulShutdown = async (signal: string, error?: Error) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.warn(
      chalk.yellow(`\n[${signal}] Shutting down process ${process.pid}...`),
    );

    if (error) {
      console.error(chalk.red("Trace:"), error.stack || error.message);
    }

    const forceExit = setTimeout(() => {
      console.error(chalk.bgRed("Shutdown timed out. Forcing exit."));
      process.exit(1);
    }, 10000);

    try {
      server?.close();
      await Promise.allSettled([prisma.$disconnect(), redisServer.stop()]);
      clearTimeout(forceExit);
      process.exit(0);
    } catch (err) {
      console.error(chalk.red("Cleanup failed:"), err);
      process.exit(1);
    }
  };

  process.on("unhandledRejection", (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    const isNetworkError = /ECONNREFUSED|ECONNRESET|ETIMEDOUT|Connection/.test(
      error.message,
    );

    if (isNetworkError) {
      console.error(
        chalk.yellow(`[Network] ${error.message}. Reconnecting...`),
      );
      prisma.$connect().catch(() => {});
    } else {
      gracefulShutdown("unhandledRejection", error);
    }
  });

  process.on("uncaughtException", (err) => {
    const isNetworkError = /ECONNREFUSED|ECONNRESET|ETIMEDOUT|Connection/.test(
      err.message,
    );

    if (isNetworkError) {
      console.error(chalk.yellow(`[Network] ${err.message}. Reconnecting...`));
      prisma.$connect().catch(() => {});
    } else {
      gracefulShutdown("uncaughtException", err);
    }
  });

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}
