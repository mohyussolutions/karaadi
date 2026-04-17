export interface SearchableItem {
  title?: string;
  city?: string;
  description?: string;
  [key: string]: unknown;
}

export const normalizeQueryWords = (q: string | undefined | null): string[] => {
  if (!q) return [];
  return q
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
};

export const itemMatchesQuery = (
  item: SearchableItem,
  query: string | undefined | null,
): boolean => {
  const words = normalizeQueryWords(query);
  if (words.length === 0) return true;

  const haystack = [item.title, item.city, item.description]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase())
    .join(" ");

  return words.every((w) => haystack.includes(w));
};

const searchUtils = { normalizeQueryWords, itemMatchesQuery };
export default searchUtils;
