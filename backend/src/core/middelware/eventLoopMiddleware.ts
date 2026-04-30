import { monitorEventLoopDelay } from "node:perf_hooks";
import type { Request, Response, NextFunction } from "express";

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

const THRESHOLD_MS = 300;
const CONSECUTIVE_LIMIT = 10;
let consecutiveHighDelay = 0;

setInterval(() => {
  const meanMs = histogram.mean / 1e6;
  if (meanMs > THRESHOLD_MS) {
    consecutiveHighDelay++;
  } else {
    consecutiveHighDelay = Math.max(0, consecutiveHighDelay - 1);
  }
  histogram.reset();
}, 5000);

export const eventLoopMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (consecutiveHighDelay >= CONSECUTIVE_LIMIT) {
    res.setHeader("Retry-After", "5");
    return res.status(503).json({
      error: "Service Temporarily Busy",
      message: "Server is optimizing resources. Please try again in a moment.",
    });
  }
  next();
};
