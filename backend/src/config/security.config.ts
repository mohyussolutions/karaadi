const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const isProd = process.env.NODE_ENV === "production";

export const SECURITY_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:3001"],

  GLOBAL_LIMIT_WINDOW: getEnvNumber("GLOBAL_LIMIT_WINDOW", 15 * 60 * 1000),
  GLOBAL_LIMIT_MAX: getEnvNumber("GLOBAL_LIMIT_MAX", 500),

  AUTH_LIMIT_WINDOW: 15 * 60 * 1000,
  AUTH_LIMIT_MAX: isProd ? 50 : 500,

  LOGIN_FAIL_WINDOW: 15 * 60 * 1000,
  LOGIN_FAIL_MAX: getEnvNumber("LOGIN_FAIL_MAX", isProd ? 20 : 50),

  SPEED_LIMIT_WINDOW: 15 * 60 * 1000,
  SPEED_LIMIT_COUNT: getEnvNumber("SPEED_LIMIT_COUNT", 50),

  PAYLOAD_LIMIT: process.env.PAYLOAD_LIMIT || "20mb",
} as const;
