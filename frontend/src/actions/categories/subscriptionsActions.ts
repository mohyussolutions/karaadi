"use server";

import { SUBS_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { Subscription } from "@/app/utils/types/subscription";

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
  forceCache = false,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    } as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

export async function createSubscription(data: Record<string, unknown>) {
  try {
    return await fetchApi(SUBS_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function getUserSubscriptions(
  userId: string,
  options?: { activeOnly?: boolean; page?: number; limit?: number },
  forceCache = true,
) {
  const params = new URLSearchParams();
  if (options?.activeOnly) params.set("activeOnly", "true");
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));
  try {
    return await fetchApi(
      `${SUBS_ENDPOINTS.GET_USER_SUBSCRIPTIONS(userId)}?${params}`,
      undefined,
      forceCache,
    );
  } catch {
    return [];
  }
}

export async function searchSubscriptions(
  filters: Record<string, unknown>,
  forceCache = true,
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null) params.set(key, String(value));
  });
  try {
    return await fetchApi(
      `${SUBS_ENDPOINTS.SEARCH}?${params}`,
      undefined,
      forceCache,
    );
  } catch {
    return [];
  }
}

export async function getAllSubscriptionsAdmin(
  filters: Record<string, unknown>,
  forceCache = true,
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });
  try {
    const data = await fetchApi<{ subscriptions: Subscription[] }>(
      `${SUBS_ENDPOINTS.ADMIN_ALL}?${params}`,
      undefined,
      forceCache,
    );
    return data.subscriptions || [];
  } catch {
    return [];
  }
}

export async function updateSubscriptionStatus(
  id: string,
  data: Record<string, unknown>,
) {
  try {
    return await fetchApi(SUBS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function deleteSubscriptionAdmin(id: string) {
  try {
    return await fetchApi(SUBS_ENDPOINTS.ADMIN_DELETE(id), {
      method: "DELETE",
    });
  } catch {
    return { success: false };
  }
}

export async function getSubscriptionStats(period = "all", forceCache = true) {
  try {
    const data = await fetchApi<{ stats: unknown }>(
      `${SUBS_ENDPOINTS.STATS}?period=${period}`,
      undefined,
      forceCache,
    );
    return data.stats;
  } catch {
    return { total: 0, active: 0, expired: 0 };
  }
}

export async function getTotalSubscriptions(forceCache = true) {
  try {
    const timeout = 300;
    return await Promise.race([
      fetchApi(SUBS_ENDPOINTS.TOTAL, undefined, true),
      new Promise((resolve) =>
        setTimeout(() => resolve({ total: 0 }), timeout),
      ),
    ]);
  } catch {
    return { total: 0 };
  }
}

export async function triggerManualNotification(data: Record<string, unknown>) {
  try {
    return await fetchApi(SUBS_ENDPOINTS.ADMIN_NOTIFY, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function getMySubscriptions(
  forceCache = true,
): Promise<Subscription[]> {
  try {
    const data = await fetchApi<{ subscriptions: Subscription[] }>(
      SUBS_ENDPOINTS.GET_MY_SUBSCRIPTIONS,
      undefined,
      forceCache,
    );
    return data.subscriptions || [];
  } catch {
    return [];
  }
}

export async function getAllSubscriptionPaid(
  forceCache = true,
): Promise<Subscription[]> {
  try {
    const data = await fetchApi<{ subscriptions: Subscription[] }>(
      SUBS_ENDPOINTS.GET_SUBSCRIPTION,
      undefined,
      forceCache,
    );
    return data.subscriptions || [];
  } catch {
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
