import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const validate = {
  register: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("username")
      .notEmpty()
      .trim()
      .escape()
      .withMessage("Username required"),
  ],
  login: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  boat: [
    body("title").notEmpty().trim().escape().withMessage("Title required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("region").notEmpty().trim().escape().withMessage("Region required"),
    body("city").notEmpty().trim().escape().withMessage("City required"),
  ],
  handleErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const sanitizedBody = { ...req.body } as any;
      if (sanitizedBody.password) sanitizedBody.password = "***";
      console.error(
        "Validation failed:",
        (errors.array() as any[]).map((e) => ({ param: e.param, msg: e.msg })),
        "bodyKeys:",
        Object.keys(req.body),
        "sanitizedBody:",
        sanitizedBody,
      );
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
};
