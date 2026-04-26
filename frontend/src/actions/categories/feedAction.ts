"use server";

import { FEED_ENDPOINTS } from "../constant/constant";

export async function fetchFeed(page: string, pageSize: string) {
  const res = await fetch(FEED_ENDPOINTS.PAGE(Number(page), Number(pageSize)), {
    next: { revalidate: 30 },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
