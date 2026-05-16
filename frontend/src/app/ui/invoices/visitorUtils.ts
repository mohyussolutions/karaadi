import Cookies from "js-cookie";

export const VISITOR_ID_KEY = "karaadi_vid";

export function getVisitorId(): string {
  let id = Cookies.get(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    Cookies.set(VISITOR_ID_KEY, id, { expires: 365 });
  }
  return id;
}

export function getLang(): string {
  return document.cookie.match(/app_lang=([^;]+)/)?.[1] ?? "en";
}
