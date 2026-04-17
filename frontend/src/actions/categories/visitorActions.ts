"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL } from "../constant/BASE_API_URL";

const API_BASE = `${BASE_API_URL}/api`;

export interface Visitor {
  id: string;
  userId: string | null;
  visitedAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface VisitorStats {
  total: number;
  today: number;
  unique: number;
}

export async function fetchVisitors(): Promise<Visitor[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/visitors/all`, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : data.visitors || [];
}

export async function getBatchVisitorData() {
  const visitors = await fetchVisitors();
  if (!visitors.length) {
    return { visitors: [], stats: { total: 0, today: 0, unique: 0 } };
  }

  const todayStr = new Date().toDateString();
  let todayCount = 0;
  const uniqueIds = new Set();

  for (const v of visitors) {
    if (new Date(v.visitedAt).toDateString() === todayStr) todayCount++;
    if (v.userId) uniqueIds.add(v.userId);
  }

  return {
    visitors,
    stats: {
      total: visitors.length,
      today: todayCount,
      unique: uniqueIds.size,
    },
  };
}

export async function fetchVisitorStats(): Promise<VisitorStats> {
  const { stats } = await getBatchVisitorData();
  return stats;
}

export async function fetchTotalVisitors(): Promise<number> {
  const visitors = await fetchVisitors();
  return visitors.length;
}

export async function deleteVisitor(id: string): Promise<boolean> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/visitors/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  return res.ok;
}

export async function resolveCountries(
  ips: string[],
): Promise<Record<string, string>> {
  const isPrivate = (ip: string) =>
    ip === "::1" ||
    ip === "localhost" ||
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^::ffff:127\./.test(ip);

  const unique = [
    ...new Set(ips.filter((ip) => ip && ip !== "Unknown" && !isPrivate(ip))),
  ];
  if (!unique.length) return {};

  const map: Record<string, string> = {};
  for (let i = 0; i < unique.length; i += 100) {
    const batch = unique.slice(i, i + 100);
    try {
      const res = await fetch(
        "http://ip-api.com/batch?fields=query,countryCode,country",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch.map((q) => ({ query: q }))),
          cache: "force-cache",
        },
      );
      if (res.ok) {
        const data: {
          query: string;
          country?: string;
          countryCode?: string;
        }[] = await res.json();
        data.forEach((d) => {
          if (d.country && d.countryCode)
            map[d.query] = `${d.countryCode} ${d.country}`;
          else if (d.country) map[d.query] = d.country;
        });
      }
    } catch {}
  }
  return map;
}
