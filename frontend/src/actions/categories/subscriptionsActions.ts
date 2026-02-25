"use server";

import { cookies } from "next/headers";
import { SUBS_ENDPOINTS } from "../constant/constant";

interface Subscription {
  id: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  priceMin?: number;
  priceMax?: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
  expiryDate?: string;
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
  retries = 2,
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const cacheBuster = `_t=${Date.now()}`;
  const separator = url.includes("?") ? "&" : "?";
  const absoluteUrl = url.startsWith("http")
    ? `${url}${separator}${cacheBuster}`
    : `${apiUrl}${url}${separator}${cacheBuster}`;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(absoluteUrl, {
        ...options,
        headers: {
          ...options?.headers,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 404) {
          throw new Error(
            `API error 404: Not found.\nURL: ${absoluteUrl}\nPossible causes: endpoint does not exist, wrong URL, or backend route is missing. Details: ${errorText}`,
          );
        }
        throw new Error(`API error ${res.status}: ${errorText}`);
      }

      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error("Request failed");
}

export async function createSubscription(data: any) {
  return fetchApi(SUBS_ENDPOINTS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getUserSubscriptions(userId: string, options?: any) {
  const params = new URLSearchParams();
  if (options?.activeOnly) params.set("activeOnly", "true");
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  return fetchApi(`${SUBS_ENDPOINTS.GET_USER_SUBSCRIPTIONS(userId)}?${params}`);
}

export async function searchSubscriptions(filters: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null) params.set(key, String(value));
  });
  return fetchApi(`${SUBS_ENDPOINTS.SEARCH}?${params}`);
}

export async function getAllSubscriptionsAdmin(
  filters: Record<string, unknown>,
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  const data = await fetchApi<{ subscriptions: Subscription[] }>(
    `${SUBS_ENDPOINTS.ADMIN_ALL}?${params}`,
  );
  return data.subscriptions || [];
}

export async function updateSubscriptionStatus(id: string, data: any) {
  return fetchApi(SUBS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteSubscriptionAdmin(id: string) {
  return fetchApi(SUBS_ENDPOINTS.ADMIN_DELETE(id), { method: "DELETE" });
}

export async function getSubscriptionStats(period = "all") {
  const data = await fetchApi<{ stats: unknown }>(
    `${SUBS_ENDPOINTS.STATS}?period=${period}`,
  );
  return data.stats;
}

export async function getTotalSubscriptions() {
  return fetchApi(SUBS_ENDPOINTS.TOTAL);
}

export async function triggerManualNotification(data: Record<string, unknown>) {
  return fetchApi(SUBS_ENDPOINTS.ADMIN_NOTIFY, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMySubscriptions(): Promise<Subscription[]> {
  try {
    const data = await fetchApi<{
      success: boolean;
      subscriptions: Subscription[];
    }>(SUBS_ENDPOINTS.GET_MY_SUBSCRIPTIONS);
    return data.subscriptions || [];
  } catch (err) {
    return [];
  }
}

export async function getAllSubscriptionPaid(): Promise<Subscription[]> {
  try {
    const data = await fetchApi<{
      success: boolean;
      subscriptions: Subscription[];
    }>(SUBS_ENDPOINTS.GET_SUBSCRIPTION);
    return data.subscriptions || [];
  } catch (err) {
    return [];
  }
}

export async function getBatchSubscriptions() {
  const [mySubs, paidSubs] = await Promise.allSettled([
    getMySubscriptions(),
    getAllSubscriptionPaid(),
  ]);

  return {
    mySubs: mySubs.status === "fulfilled" ? mySubs.value : [],
    paidSubs: paidSubs.status === "fulfilled" ? paidSubs.value : [],
  };
}
