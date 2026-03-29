import { monitorEventLoopDelay } from "node:perf_hooks";
import type { Request, Response, NextFunction } from "express";

const eventLoopDelay = monitorEventLoopDelay({ resolution: 20 });
eventLoopDelay.enable();

export const eventLoopMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (eventLoopDelay.mean / 1e6 > 200) {
    return res.status(503).json({ message: "Server overloaded." });
  }
  next();
};
