import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  property: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      const firstError =
        result.error.issues?.[0]?.message || "Validation failed";
      const missingFields = result.error.issues
        .filter(
          (issue) =>
            issue.code === "invalid_type" &&
            typeof (issue as any).received === "undefined",
        )
        .map((issue) => issue.path.join("."));
      return res.status(400).json({
        error: "Validation failed",
        message: firstError,
        missingFields,
        details: result.error.format(),
      });
    }
    if (property === "body") {
      req.body = result.data;
    } else if (property === "query") {
      Object.assign(req.query, result.data);
    } else if (property === "params") {
      Object.assign(req.params, result.data);
    }
    next();
  };
}
