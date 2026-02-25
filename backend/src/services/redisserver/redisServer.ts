import chalk from "chalk";
import cacheManager from "./cacheManager.ts";

class RedisServer {
  private static instance: RedisServer;

  private constructor() {}

  public static getInstance(): RedisServer {
    if (!RedisServer.instance) RedisServer.instance = new RedisServer();
    return RedisServer.instance;
  }

  public async start(): Promise<void> {
    try {
      await cacheManager.connect();
      const redisHealthy = await cacheManager.healthCheck();
      if (redisHealthy) {
        console.log(chalk.green("Redis connected and healthy"));
      }
    } catch (error) {
      console.error(chalk.red("Redis connection failed"), error);
      throw error;
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
