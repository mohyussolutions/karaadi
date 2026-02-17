import cacheManager from "./cacheManager.ts";
import chalk from "chalk";

class RedisServer {
  private static instance: RedisServer;

  private constructor() {}

  public static getInstance(): RedisServer {
    if (!RedisServer.instance) {
      RedisServer.instance = new RedisServer();
    }
    return RedisServer.instance;
  }

  public async start(): Promise<void> {
    try {
      await cacheManager.connect();
      const redisHealthy = await cacheManager.healthCheck();
      if (redisHealthy) {
        console.log(chalk.green("Redis connected and healthy"));
      } else {
        console.log(chalk.red("Redis health check failed"));
      }
    } catch (error) {
      console.error(chalk.red("Redis connection failed"), error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      await cacheManager.disconnect();
      console.log(chalk.yellow("Redis disconnected"));
    } catch (error) {
      console.error(chalk.red("Redis server stop error:"), error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    return await cacheManager.healthCheck();
  }

  public async getStatus(): Promise<{
    isReady: boolean;
    isConnected: boolean;
    memoryUsage: any;
  }> {
    const isReady = cacheManager.isReady();
    const healthCheck = await this.healthCheck();
    const memoryUsage = await cacheManager.getMemoryUsage();

    return {
      isReady,
      isConnected: healthCheck,
      memoryUsage,
    };
  }
}

const redisServer = RedisServer.getInstance();
export default redisServer;
