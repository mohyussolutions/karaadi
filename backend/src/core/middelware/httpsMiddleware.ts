import type { Request, Response, NextFunction } from "express";

export const httpsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
};
