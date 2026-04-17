import i18next from "i18next";
import Backend from "i18next-fs-backend";
import * as middleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "so"],
    ns: ["translation"],
    backend: {
      loadPath: path.join(__dirname, "../../locales/{{lng}}/{{ns}}.json"),
    },
    detection: {
      order: ["cookie", "header"],
      caches: ["cookie"],
    },
  });

export const handle = middleware.handle(i18next);
export default i18next;

import { Request, Response, NextFunction } from "express";
import { Locale } from "../../types/index.ts";
declare module "express-serve-static-core" {
  interface Request {
    lang?: Locale;
  }
}
const DEFAULT_LANG: Locale = "EN";

export function detectLang(req: Request): Locale {
  const lang = req.headers["x-lang"] || req.headers["accept-language"];

  if (typeof lang === "string") {
    const l = lang.toLowerCase();
    if (l.startsWith("so")) return "SO";
    if (l.startsWith("en")) return "EN";
  }

  return DEFAULT_LANG;
}

export function i18nMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.lang = detectLang(req);
  next();
}
