import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cors from "cors";

export const setupSecurity = (app: express.Application) => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || "http://localhost:3000"
  ).split(",");

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
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
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
    }),
  );

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 50 : 500,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: (hits) => hits * 100,
  });

  app.use(globalLimiter);
  app.use(speedLimiter);

  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(express.json({ limit: "1mb" }));

  return { authLimiter };
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "5 jeer ayaad isku dayday. Sug 15 daqiiqo.",
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});
