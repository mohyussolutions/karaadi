import {
  CACHE_KEYS,
  CACHE_TTL,
  ERROR_MESSAGES,
  LOG_MESSAGES,
  REDIS_CONFIG,
} from "../../config/contstanst.ts";
import { createClient, RedisClientType } from "redis";

class CacheManager {
  private client: RedisClientType;
  private static instance: CacheManager;
  private isConnected = false;

  private constructor() {
    this.client = createClient({
      url: REDIS_CONFIG.URL,
      socket: {
        reconnectStrategy: (retries: number): number | Error => {
          if (retries > REDIS_CONFIG.MAX_RETRIES) {
            return new Error(ERROR_MESSAGES.CONNECTION_FAILED);
          }
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
    this.client.on("error", (err: Error) => {
      console.error(ERROR_MESSAGES.CLIENT_ERROR, err);
      this.isConnected = false;
    });

    this.client.on("connect", () => {
      console.log(LOG_MESSAGES.CONNECTING);
    });

    this.client.on("ready", () => {
      this.isConnected = true;
      console.log(LOG_MESSAGES.CONNECTED);
    });

    this.client.on("end", () => {
      this.isConnected = false;
      console.log(LOG_MESSAGES.DISCONNECTED);
    });

    this.client.on("reconnecting", () => {
      console.log(LOG_MESSAGES.RECONNECTING);
    });
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;
    try {
      await this.client.connect();
    } catch (error) {
      console.error(ERROR_MESSAGES.CONNECTION_FAILED, error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  public isReady(): boolean {
    return this.isConnected && this.client.isOpen;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const pong = await this.client.ping();
      return pong === "PONG";
    } catch {
      return false;
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isReady()) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public async set(
    key: string,
    value: any,
    ttlSeconds: number = CACHE_TTL.DEFAULT,
  ): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const stringValue = JSON.stringify(value);
      await this.client.setEx(key, ttlSeconds, stringValue);
      return true;
    } catch {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch {
      return false;
    }
  }

  public async deletePattern(pattern: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch {
      return false;
    }
  }

  public async increment(key: string, by: number = 1): Promise<number> {
    if (!this.isReady()) return 0;
    try {
      return await this.client.incrBy(key, by);
    } catch {
      return 0;
    }
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch {
      return false;
    }
  }

  public async withCache<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttlSeconds: number = CACHE_TTL.DEFAULT,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const freshData = await fetchData();
    await this.set(key, freshData, ttlSeconds);
    return freshData;
  }

  public async cacheUserSession(
    userId: string,
    sessionData: any,
  ): Promise<boolean> {
    return await this.set(
      CACHE_KEYS.USER_SESSION(userId),
      sessionData,
      CACHE_TTL.USER_SESSION,
    );
  }

  public async getUserSession(userId: string): Promise<any | null> {
    return await this.get(CACHE_KEYS.USER_SESSION(userId));
  }

  public async clearUserSession(userId: string): Promise<boolean> {
    return await this.delete(CACHE_KEYS.USER_SESSION(userId));
  }

  public async cacheAdvertisements(
    ads: any[],
    position?: string,
  ): Promise<boolean> {
    const key = position
      ? CACHE_KEYS.ADS_POSITION(position)
      : CACHE_KEYS.ADS_ALL;
    return await this.set(key, ads, CACHE_TTL.ADS);
  }

  public async getAdvertisements(position?: string): Promise<any[] | null> {
    const key = position
      ? CACHE_KEYS.ADS_POSITION(position)
      : CACHE_KEYS.ADS_ALL;
    return await this.get<any[]>(key);
  }

  public async cacheAdvertisement(adId: string, adData: any): Promise<boolean> {
    return await this.set(
      CACHE_KEYS.AD_DETAIL(adId),
      adData,
      CACHE_TTL.AD_DETAIL,
    );
  }

  public async getAdvertisement(adId: string): Promise<any | null> {
    return await this.get(CACHE_KEYS.AD_DETAIL(adId));
  }

  public async invalidateAdvertisement(adId: string): Promise<boolean> {
    await this.deletePattern(`ad:*:${adId}`);
    await this.deletePattern(`ads:*`);
    return await this.delete(CACHE_KEYS.AD_DETAIL(adId));
  }

  public async cacheVisitorStats(stats: any): Promise<boolean> {
    return await this.set(
      CACHE_KEYS.VISITOR_STATS,
      stats,
      CACHE_TTL.VISITOR_STATS,
    );
  }

  public async getVisitorStats(): Promise<any | null> {
    return await this.get(CACHE_KEYS.VISITOR_STATS);
  }

  public async cacheCategoryListings(
    category: string,
    listings: any[],
    filters: any = {},
  ): Promise<boolean> {
    const key = CACHE_KEYS.CATEGORY_LISTINGS(category, filters);
    return await this.set(key, listings, CACHE_TTL.CATEGORY_LISTINGS);
  }

  public async getCategoryListings(
    category: string,
    filters: any = {},
  ): Promise<any[] | null> {
    const key = CACHE_KEYS.CATEGORY_LISTINGS(category, filters);
    return await this.get<any[]>(key);
  }

  public async invalidateCategoryCache(category: string): Promise<boolean> {
    return await this.deletePattern(`listings:${category}:*`);
  }

  public async checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<boolean> {
    const current = await this.increment(CACHE_KEYS.RATE_LIMIT(key), 1);
    if (current === 1)
      await this.expire(CACHE_KEYS.RATE_LIMIT(key), windowSeconds);
    return current <= limit;
  }

  public async cacheChatMessages(
    chatId: string,
    messages: any[],
  ): Promise<boolean> {
    return await this.set(
      CACHE_KEYS.CHAT_MESSAGES(chatId),
      messages,
      CACHE_TTL.CHAT_MESSAGES,
    );
  }

  public async getChatMessages(chatId: string): Promise<any[] | null> {
    return await this.get<any[]>(CACHE_KEYS.CHAT_MESSAGES(chatId));
  }

  public async cacheSearchResults(
    query: string,
    results: any[],
  ): Promise<boolean> {
    const queryHash = Buffer.from(query).toString("base64").slice(0, 32);
    return await this.set(
      CACHE_KEYS.SEARCH_RESULTS(queryHash),
      results,
      CACHE_TTL.SEARCH_RESULTS,
    );
  }

  public async getSearchResults(query: string): Promise<any[] | null> {
    const queryHash = Buffer.from(query).toString("base64").slice(0, 32);
    return await this.get<any[]>(CACHE_KEYS.SEARCH_RESULTS(queryHash));
  }

  public async cacheUserNotifications(
    userId: string,
    notifications: any[],
  ): Promise<boolean> {
    return await this.set(
      CACHE_KEYS.USER_NOTIFICATIONS(userId),
      notifications,
      CACHE_TTL.USER_NOTIFICATIONS,
    );
  }

  public async getUserNotifications(userId: string): Promise<any[] | null> {
    return await this.get<any[]>(CACHE_KEYS.USER_NOTIFICATIONS(userId));
  }

  public async getStats(): Promise<Record<string, any>> {
    if (!this.isReady()) return {};
    try {
      const info = await this.client.info();
      const stats: Record<string, any> = {};
      info.split("\n").forEach((line) => {
        const [key, value] = line.split(":");
        if (key && value) stats[key.trim()] = value.trim();
      });
      return stats;
    } catch {
      return {};
    }
  }

  public async flushAll(): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await this.client.flushAll();
      return true;
    } catch {
      return false;
    }
  }

  public generateCacheKey(prefix: string, ...parts: any[]): string {
    const stringParts = parts.map((part) =>
      typeof part === "object" ? JSON.stringify(part) : String(part),
    );
    return `${prefix}:${stringParts.join(":")}`;
  }

  public async getMemoryUsage(): Promise<{
    used_memory: string;
    used_memory_human: string;
    used_memory_peak: string;
    used_memory_peak_human: string;
  }> {
    const stats = await this.getStats();
    return {
      used_memory: stats.used_memory || "0",
      used_memory_human: stats.used_memory_human || "0B",
      used_memory_peak: stats.used_memory_peak || "0",
      used_memory_peak_human: stats.used_memory_peak_human || "0B",
    };
  }

  public getClient(): RedisClientType {
    return this.client;
  }
}

const cacheManager = CacheManager.getInstance();
export default cacheManager;
