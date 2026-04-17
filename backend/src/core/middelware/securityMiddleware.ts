import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cors from "cors";
import { SECURITY_CONFIG } from "src/config/security.config.ts";

export const setupSecurity = (app: express.Application) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  const globalLimiter = rateLimit({
    windowMs: SECURITY_CONFIG.GLOBAL_LIMIT_WINDOW,
    max: SECURITY_CONFIG.GLOBAL_LIMIT_MAX,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
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
});
