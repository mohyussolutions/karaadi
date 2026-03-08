export const SERVER_CONFIG = {
  PORT: Number(process.env.PORT || 9000),
  ENVIRONMENT: process.env.NODE_ENV || "development",
  GRACEFUL_SHUTDOWN_TIMEOUT: 10000,
  HEALTH_CHECK_INTERVAL: 30000,
} as const;

export const REDIS_CONFIG = {
  URL: process.env.REDIS_URL || "redis://localhost:6379",
  MAX_RETRIES: 10,
  RECONNECT_DELAY: 100,
  MAX_RECONNECT_DELAY: 3000,
} as const;

export const CURRENCY = "USD";
export const SUBSCRIPTION_TYPE = "SUBSCRIPTION" as const;
export const DAYS_FOR_UPLOADING_AGAIN = 90;
export const DAYS_FOR_SOLD_RESET = 3;
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const PAGINATION = {
  MAX_LIMIT: 50,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;

export const DEFAULT_PAGE = PAGINATION.DEFAULT_PAGE;
export const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_LIMIT;

export const getPaginationParams = (page?: string, limit?: string) => {
  const pageNum = Math.max(
    1,
    parseInt(page || String(PAGINATION.DEFAULT_PAGE)) ||
      PAGINATION.DEFAULT_PAGE,
  );
  const pageSize = Math.min(
    PAGINATION.MAX_LIMIT,
    parseInt(limit || String(PAGINATION.DEFAULT_LIMIT)) ||
      PAGINATION.DEFAULT_LIMIT,
  );
  return { page: pageNum, limit: pageSize, skip: (pageNum - 1) * pageSize };
};

export const LISTING_TYPES = {
  FREE: 0,
  FEE: 1,
} as const;

export const CATEGORY_MAP: Record<string, string> = {
  CAR: "car",
  BOAT: "boat",
  REAL_ESTATE: "realEstate",
  MOTORCYCLE: "motorcycle",
  TRAKTOR: "traktor",
  MARKETPLACE: "marketplace",
};

export const FEE_KEYS = [
  "art",
  "electronics",
  "animal",
  "sports",
  "furniture",
  "fashion",
  "rent",
  "sale",
  "land",
  "farm",
  "business",
  "carSale",
  "carRent",
  "trailer",
  "carParts",
  "truck",
  "electricCar",
  "boatSale",
  "boatRent",
  "boatEngine",
  "boatParts",
  "tractorSale",
  "agriTool",
  "fertilizer",
  "harvester",
  "motoSale",
  "motoRent",
  "motoParts",
  "motoOther",
  "fullTime",
  "partTime",
  "freelance",
  "subStandard",
  "subStandard60",
  "subPremium",
  "subSixMonth",
  "subPremiumYear",
  "taxRate",
  "waafi",
  "platformFee",
] as const;

export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `user:${userId}:session`,
  ADS_ALL: "ads:all",
  ADS_POSITION: (position: string) => `ads:position:${position}`,
  AD_DETAIL: (adId: string) => `ad:${adId}`,
  VISITOR_STATS: "stats:visitors",
  CATEGORY_LISTINGS: (category: string, filters?: any) => {
    const filterKey =
      filters && Object.keys(filters).length > 0
        ? `:${JSON.stringify(filters)}`
        : "";
    return `listings:${category}${filterKey}`;
  },
  RATE_LIMIT: (key: string) => `ratelimit:${key}`,
  CHAT_MESSAGES: (chatId: string) => `chat:${chatId}:messages`,
  SEARCH_RESULTS: (queryHash: string) => `search:${queryHash}`,
  USER_NOTIFICATIONS: (userId: string) => `notifications:${userId}`,
  JOBS_ALL_PAID: "jobs:all:paid",
  JOBS_TOTAL_COUNT: "jobs:total:count",
} as const;

export const CACHE_TTL = {
  USER_SESSION: 86400,
  USER: 300,
  PROFILE: 300,
  ADS: 300,
  AD_DETAIL: 600,
  VISITOR_STATS: 600,
  CATEGORY_LISTINGS: 300,
  CHAT_MESSAGES: 1800,
  SEARCH_RESULTS: 900,
  USER_NOTIFICATIONS: 300,
  STATS: 600,
  LIST: 60,
  SHORT: 30,
  SEARCH: 120,
  DETAIL: 300,
  DEFAULT: 3600,
} as const;

export const ERROR_MESSAGES = {
  CONNECTION_FAILED: "Redis connection failed after maximum retries",
  CLIENT_ERROR: "Redis Client Error",
  HEALTH_CHECK_FAILED: "Redis health check failed",
} as const;

export const LOG_MESSAGES = {
  CONNECTING: "Redis connecting",
  CONNECTED: "Redis connected and ready",
  DISCONNECTED: "Redis disconnected",
  RECONNECTING: "Redis reconnecting",
  HEALTHY: "CacheManager connected and healthy",
  UNHEALTHY: "CacheManager health check failed",
} as const;

export const SERVER_MESSAGES = {
  STARTING: "Starting server",
  REDIS_CONNECTED: "CacheManager connected and healthy",
  REDIS_UNHEALTHY: "CacheManager health check failed",
  REDIS_CONNECTION_FAILED: "CacheManager connection failed",
  DATABASE_CONNECTED: "Database connected",
  DATABASE_CONNECTION_FAILED: "Database connection failed",
  SERVER_RUNNING: (port: number) => `Server running on port ${port}`,
  ENVIRONMENT: (env: string) => `Environment: ${env}`,
  REDIS_MEMORY: (memory: string) => `Redis memory: ${memory}`,
  SHUTTING_DOWN: "Shutting down gracefully",
  REDIS_DISCONNECTED: "CacheManager disconnected",
  REDIS_SHUTDOWN_ERROR: "CacheManager shutdown error",
  DATABASE_DISCONNECTED: "Database disconnected",
  DATABASE_SHUTDOWN_ERROR: "Database shutdown error",
  HTTP_SERVER_CLOSED: "HTTP server closed",
  FORCED_SHUTDOWN: "Forced shutdown after timeout",
  REDIS_RECONNECTING: "Redis health check failed, attempting to reconnect",
  REDIS_RECONNECTION_FAILED: "Redis reconnection failed",
} as const;
