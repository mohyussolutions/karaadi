export type ParsedQuery = {
  text: string;
  location: string;
  price: number | undefined;
};

export function parseSearchQuery(raw: string): ParsedQuery {
  if (!raw.trim()) return { text: "", location: "", price: undefined };

  // Collapse "45 000" / "45,000" digit groups → "45000"
  const normalized = raw.replace(/(\d)[\s,]+(\d)/g, "$1$2");

  // Split on "/" for name/location/city format
  const parts = normalized.split("/").map((p) => p.trim()).filter(Boolean);

  let price: number | undefined;

  const cleanParts = parts.map((part) =>
    part
      .replace(/\b(\d{3,})\b/g, (m) => {
        const n = Number(m);
        if (n >= 100) {
          price = n;
          return "";
        }
        return m;
      })
      .replace(/\s{2,}/g, " ")
      .trim(),
  ).filter(Boolean);

  const [first = "", ...rest] = cleanParts;

  return {
    text: first,
    location: rest.join(" ").toLowerCase(),
    price,
  };
}
