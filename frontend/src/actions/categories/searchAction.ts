const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchSearch(q: string) {
  if (!q.trim()) return [];
  const res = await fetch(
    `${BACKEND}/api/search?q=${encodeURIComponent(q)}`,
    { cache: "no-store" },
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
