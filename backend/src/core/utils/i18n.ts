import fs from "fs";
import path from "path";
import type { Locale } from "../../types/index.ts";

const LOCALES_DIR = path.join(process.cwd(), "locales");

let cache: Record<string, any> = {};

const DEFAULT_LANG: Locale = "EN";

function loadLocale(lang: Locale) {
  if (cache[lang]) return cache[lang];

  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) return {};

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  cache[lang] = data;

  return data;
}

export function t(
  key: string,
  lang: Locale = DEFAULT_LANG,
  vars?: Record<string, string | number>,
) {
  const locale = loadLocale(lang);

  const value = key.split(".").reduce((acc, k) => {
    if (acc && typeof acc === "object") return acc[k];
    return null;
  }, locale);

  if (typeof value !== "string") return key;

  let result = value;

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{{${k}}}`, "g"), String(v));
    }
  }

  return result;
}

export function setLocaleCache(newCache: Record<string, any>) {
  cache = newCache;
}
