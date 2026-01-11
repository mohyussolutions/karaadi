import cacheManager from "./cacheManager.ts";

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
        console.log("Redis connected and healthy");
      } else {
        console.log("Redis health check failed");
      }
    } catch (error) {
      console.error("Redis connection failed", error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      await cacheManager.disconnect();
      console.log("Redis disconnected");
    } catch (error) {
      console.error("Redis server stop error:", error);
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
