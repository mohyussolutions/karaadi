import { monitorEventLoopDelay } from "node:perf_hooks";
import type { Request, Response, NextFunction } from "express";
import { EVENT_LOOP } from "src/config/config.constants.ts";

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

let consecutiveHighDelay = 0;

setInterval(() => {
  const meanMs = histogram.mean / 1e6;
  if (meanMs > EVENT_LOOP.THRESHOLD_MS) {
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
  if (consecutiveHighDelay >= EVENT_LOOP.CONSECUTIVE_LIMIT) {
    res.setHeader("Retry-After", "5");
    return res.status(503).json({
      error: "Service Temporarily Busy",
      message: "Server is optimizing resources. Please try again in a moment.",
    });
  }
  next();
};
