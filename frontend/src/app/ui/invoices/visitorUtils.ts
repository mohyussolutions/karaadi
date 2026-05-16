export const VISITOR_ID_KEY = "karaadi_vid";

export function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getLang(): string {
  return document.cookie.match(/app_lang=([^;]+)/)?.[1] ?? "en";
}
