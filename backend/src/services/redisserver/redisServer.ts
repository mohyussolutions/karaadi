import chalk from "chalk";
import cacheManager from "./cacheManager.ts";
import cluster from "node:cluster";

class RedisServer {
  private static instance: RedisServer;
  private constructor() {}

  public static getInstance(): RedisServer {
    if (!RedisServer.instance) RedisServer.instance = new RedisServer();
    return RedisServer.instance;
  }

  public getClient() {
    return cacheManager.getClient();
  }

  public async start(): Promise<void> {
    try {
      await cacheManager.connect();

      if (await cacheManager.healthCheck()) {
        const status = await this.getStatus();
        const usage = status.memoryUsage.used_memory_human || "0B";

        if (cluster.isPrimary || (cluster.worker && cluster.worker.id === 1)) {
          console.log(chalk.green("Redis connected and healthy"));
          console.log(chalk.cyan(`Redis Ready | Usage: ${usage}`));
        }
      }
    } catch (error) {
      console.error(chalk.red("Redis connection failed"), error);
    }
  }

  public async stop(): Promise<void> {
    await cacheManager.disconnect();
    console.log(chalk.yellow("Redis disconnected"));
  }

  public async getStatus() {
    const memory = await cacheManager.getMemoryUsage();
    return {
      isReady: cacheManager.isReady(),
      isConnected: await cacheManager.healthCheck(),
      memoryUsage: memory,
    };
  }
}

export default RedisServer.getInstance();
