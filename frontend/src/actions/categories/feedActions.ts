"use server";

import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function loadFeedPage(page: number): Promise<UniversalCardProps[]> {
  try {
    const res = await fetch(`${BACKEND}/api/feed?page=${page}&pageSize=70`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as UniversalCardProps[]) : [];
  } catch {
    return [];
  }
}
