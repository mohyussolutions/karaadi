import { createClient, RedisClientType } from "redis";
import chalk from "chalk";
import {
  REDIS_CONFIG,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  CACHE_TTL,
} from "src/config/fee.ts";

class CacheManager {
  private client: RedisClientType;
  private static instance: CacheManager;
  private isConnected = false;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || REDIS_CONFIG.URL,
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

  public getClient(): RedisClientType {
    return this.client;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected && !this.client.isOpen) await this.client.connect();
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) await this.client.quit();
  }

  public isReady(): boolean {
    return this.isConnected && this.client.isOpen;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      return (await this.client.ping()) === "PONG";
    } catch {
      return false;
    }
  }

  public async getMemoryUsage(): Promise<any> {
    if (!this.isReady()) return { used_memory_human: "0B" };
    try {
      const info = await this.client.info("memory");
      const stats: any = {};
      info.split("\r\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (value) stats[key] = value;
      });
      return stats;
    } catch {
      return { error: "Error fetching memory" };
    }
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
  }

  public async delete(key: string): Promise<void> {
    if (!this.isReady()) return;
    await this.client.del(key);
  }

  public async deletePattern(pattern: string): Promise<void> {
    if (!this.isReady()) return;
    let cursor = "0";
    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      if (reply.keys.length > 0) {
        await this.client.del(reply.keys);
        console.log(chalk.red(`[DEL PATTERN] ${pattern}`));
      }
    } while (cursor !== "0");
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
}

export default CacheManager.getInstance();
