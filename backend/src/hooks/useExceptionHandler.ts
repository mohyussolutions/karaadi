import { Server } from "http";

export const setupExceptionHandlers = () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
};

export const setupGracefulShutdown = (
  server: Server,
  prisma: any,
  redisServer: any,
) => {
  const gracefulShutdown = async () => {
    console.log("Received shutdown signal. Closing gracefully...");

    server.close(async () => {
      console.log("HTTP server closed");

      try {
        await prisma.$disconnect();
        console.log("Database disconnected");

        await redisServer.shutdown();
        console.log("Redis disconnected");

        console.log("Graceful shutdown completed");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
};
