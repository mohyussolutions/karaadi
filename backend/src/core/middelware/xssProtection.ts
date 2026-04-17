import { Request, Response, NextFunction } from "express";

export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/[<>]/g, "");
      }
    });
  }

  if (req.query && typeof req.query === "object") {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = (req.query[key] as string).replace(/[<>]/g, "");
      }
    });
  }

  next();
};
