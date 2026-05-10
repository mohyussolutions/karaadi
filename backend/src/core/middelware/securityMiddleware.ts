import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cors from "cors";
import { SECURITY_CONFIG } from "src/config/security.config.ts";

const isProd = process.env.NODE_ENV === "production";

export const setupSecurity = (app: express.Application) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed =
          SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin) ||
          /\.vercel\.app$/.test(origin) ||
          /\.amplifyapp\.com$/.test(origin) ||
          /^https?:\/\/(www\.)?karaadi\.com$/.test(origin);
        if (isAllowed) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires", "X-Access-Token"],
      optionsSuccessStatus: 200,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: isProd
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"],
            },
          }
        : false,
      hsts: isProd
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    }),
  );

  const globalLimiter = rateLimit({
    windowMs: SECURITY_CONFIG.GLOBAL_LIMIT_WINDOW,
    max: SECURITY_CONFIG.GLOBAL_LIMIT_MAX,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
  });

  const speedLimiter = slowDown({
    windowMs: SECURITY_CONFIG.SPEED_LIMIT_WINDOW,
    delayAfter: SECURITY_CONFIG.SPEED_LIMIT_COUNT,
    delayMs: (hits) => hits * 100,
  });

  app.use(globalLimiter);
  app.use(speedLimiter);

  app.use(
    express.urlencoded({
      extended: true,
      limit: SECURITY_CONFIG.PAYLOAD_LIMIT,
    }),
  );
  app.use(express.json({ limit: SECURITY_CONFIG.PAYLOAD_LIMIT }));
};

export const loginLimiter = rateLimit({
  windowMs: SECURITY_CONFIG.LOGIN_FAIL_WINDOW,
  max: SECURITY_CONFIG.LOGIN_FAIL_MAX,
  message: "Many failed attempts. Please wait 15 minutes.",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});
