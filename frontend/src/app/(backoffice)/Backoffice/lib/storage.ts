export const FIXED_USER_ID = "11111111-1111-1111-1111-111111111111";

export function saveBackofficeItem(section: string, item: Record<string, any>) {
  const key = `backoffice:${section}`;
  if (typeof window === "undefined" || !window.localStorage) {
    // server-side: no-op
    return;
  }
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  arr.push(item);
  localStorage.setItem(key, JSON.stringify(arr));
}

export function loadBackofficeItems(section: string) {
  const key = `backoffice:${section}`;
  if (typeof window === "undefined" || !window.localStorage) return [];
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function loadBackofficeItemById(section: string, id: string) {
  const items = loadBackofficeItems(section) as Array<Record<string, any>>;
  return items.find((it) => it.id === id) || null;
}

export function updateBackofficeItem(section: string, item: Record<string, any>) {
  const key = `backoffice:${section}`;
  if (typeof window === "undefined" || !window.localStorage) return;
  const items = JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, any>>;
  const idx = items.findIndex((it) => it.id === item.id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...item };
  } else {
    items.push(item);
  }
  localStorage.setItem(key, JSON.stringify(items));
}

export function deleteBackofficeItem(section: string, id: string) {
  const key = `backoffice:${section}`;
  if (typeof window === "undefined" || !window.localStorage) return;
  const items = JSON.parse(localStorage.getItem(key) || "[]") as Array<Record<string, any>>;
  const filtered = items.filter((it) => it.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
}
