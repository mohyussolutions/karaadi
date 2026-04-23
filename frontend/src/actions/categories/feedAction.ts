const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchFeed(page: string, pageSize: string) {
  const res = await fetch(
    `${BACKEND}/api/feed?page=${page}&pageSize=${pageSize}`,
    { next: { revalidate: 30 } },
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
