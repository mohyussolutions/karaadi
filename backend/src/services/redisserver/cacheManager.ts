import { createClient, RedisClientType } from "redis";
import {
  REDIS_CONFIG,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  CACHE_TTL,
} from "src/config/contstanst.ts";
import chalk from "chalk";

class CacheManager {
  private client: RedisClientType;
  private static instance: CacheManager;
  private isConnected = false;

  private constructor() {
    this.client = createClient({
      url: REDIS_CONFIG.URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > REDIS_CONFIG.MAX_RETRIES)
            return new Error(ERROR_MESSAGES.CONNECTION_FAILED);
          return Math.min(
            retries * REDIS_CONFIG.RECONNECT_DELAY,
            REDIS_CONFIG.MAX_RECONNECT_DELAY,
          );
        },
      },
    }) as RedisClientType;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on("error", (err) => {
      this.isConnected = false;
      console.error(chalk.red(ERROR_MESSAGES.CLIENT_ERROR), err);
    });
    this.client.on("ready", () => {
      this.isConnected = true;
      console.log(chalk.cyan(LOG_MESSAGES.CONNECTED));
    });
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) CacheManager.instance = new CacheManager();
    return CacheManager.instance;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) await this.client.quit();
  }

  public isReady(): boolean {
    return this.isConnected && this.client.isOpen;
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isReady()) return null;
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  public async set(
    key: string,
    value: any,
    ttl: number = CACHE_TTL.DEFAULT,
  ): Promise<void> {
    if (!this.isReady()) return;
    await this.client.setEx(key, ttl, JSON.stringify(value));
    console.log(chalk.gray(`[SET] ${key}`));
  }

  public async delete(key: string): Promise<void> {
    if (!this.isReady()) return;
    await this.client.del(key);
    console.log(chalk.yellow(`[DEL] ${key}`));
  }

  public async deletePattern(pattern: string): Promise<void> {
    if (!this.isReady()) return;
    for await (const key of this.client.scanIterator({ MATCH: pattern })) {
      await this.client.del(key);
    }
    console.log(chalk.yellow(`[DEL_PATTERN] ${pattern}`));
  }

  public async withCache<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttl: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;
    const freshData = await fetchData();
    await this.set(key, freshData, ttl);
    return freshData;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return (await this.client.ping()) === "PONG";
    } catch {
      return false;
    }
  }

  public async getMemoryUsage() {
    if (!this.isReady()) return "0B";
    const info = await this.client.info("memory");
    const match = info.match(/used_memory_human:(.*)/);
    return match ? match[1].trim() : "0B";
  }
}

export default CacheManager.getInstance();
