import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.ts";

let overloadedUntil = 0;

export function setOverloaded(seconds: number) {
  overloadedUntil = Date.now() + seconds * 1000;
}

export function overloadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (Date.now() < overloadedUntil) {
    const retry = Math.ceil((overloadedUntil - Date.now()) / 1000);
    res.setHeader("Retry-After", String(retry));
    try {
      logger.warn(
        `Rejecting request ${req.method} ${req.originalUrl} due to overload; retry in ${retry}s`,
      );
    } catch {}
    return res.status(503).json({ error: "Service Unavailable" });
  }
  return next();
}
