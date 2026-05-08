import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

export const resolveImageUrl = (url: any): string | null => {
  if (typeof url !== "string" || url.trim() === "") return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("/") ||
    url.startsWith("blob:")
  )
    return url;
  return `${BASE_API_URL}/${url}`;
};
const REGEX_CLEAN = /[^\w\s-]/g;
const REGEX_SPACES = /\s+/g;
const REGEX_DASHES = /^-+|-+$/g;
const REGEX_DUPLICATE_DASHES = /-+/g;
const REGEX_ESCAPE = /([.$?*|{}()\[\]\\/+^])/g;

export const COOKIE_REGEX = (name: string) =>
  new RegExp("(?:^|; )" + name.replace(REGEX_ESCAPE, "\\$1") + "=([^;]*)");

export const generateSlug = (base: string, title: string, href?: string) => {
  const target = href || title;
  const slug = String(target)
    .toLowerCase()
    .trim()
    .replace(REGEX_CLEAN, "")
    .replace(REGEX_SPACES, "-")
    .replace(REGEX_DUPLICATE_DASHES, "-")
    .replace(REGEX_DASHES, "");

  return `/${base}/${slug}`;
};

export const escapeRegex = (str: string): string =>
  str.replace(REGEX_ESCAPE, "\\$1");

export const getClientCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(COOKIE_REGEX(name));
  return match ? decodeURIComponent(match[1]) : undefined;
};
