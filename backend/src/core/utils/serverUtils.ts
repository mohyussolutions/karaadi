import type { Express } from "express";
import { handle } from "../middelware/i18n.ts";
import { eventLoopMiddleware } from "../middelware/eventLoopMiddleware.ts";
export const setupServerUtils = (app: Express) => {
  app.use(eventLoopMiddleware);
  app.use(handle);
};
