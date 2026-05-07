import type { Response } from "express";

export function serverError(res: Response, err: unknown): Response {
  const isDev = process.env.NODE_ENV !== "production";
  const message = isDev && err instanceof Error ? err.message : "Server error";
  return res.status(500).json({ error: message });
}
