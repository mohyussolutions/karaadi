"use server";

import { SUBS_ENDPOINTS } from "../constant/constant";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

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

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

async function fetchApi<T>(
  url: string,
  options?: RequestInit,
  retries = 2,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const headers = await getAuthHeaders();
      const cacheBustedUrl = addCacheBuster(url);

      const res = await fetch(cacheBustedUrl, {
        ...options,
        headers: {
          ...headers,
          ...options?.headers,
        } as HeadersInit,
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 401 || res.status === 403) {
          const err: any = new Error(
            "You do not have permission to access this resource.",
          );
          err.status = res.status;
          throw err;
        }
        throw new Error(
          `API error ${res.status}: ${errorText || res.statusText}`,
        );
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
  try {
    const result = await fetchApi(SUBS_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
    revalidateTag("subscriptions");
    revalidatePath("/subscriptions");
    return result;
  } catch (error) {
    return { success: false, error: "Creation failed" };
  }
}

export async function getUserSubscriptions(userId: string, options?: any) {
  const params = new URLSearchParams();
  if (options?.activeOnly) params.set("activeOnly", "true");
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));

  try {
    return await fetchApi(
      `${SUBS_ENDPOINTS.GET_USER_SUBSCRIPTIONS(userId)}?${params}`,
    );
  } catch (error) {
    return [];
  }
}

export async function searchSubscriptions(filters: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null) params.set(key, String(value));
  });

  try {
    return await fetchApi(`${SUBS_ENDPOINTS.SEARCH}?${params}`);
  } catch (error) {
    return [];
  }
}

export async function getAllSubscriptionsAdmin(
  filters: Record<string, unknown>,
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, String(value));
  });

  try {
    const data = await fetchApi<{ subscriptions: Subscription[] }>(
      `${SUBS_ENDPOINTS.ADMIN_ALL}?${params}`,
    );
    return data.subscriptions || [];
  } catch (error) {
    return [];
  }
}

export async function updateSubscriptionStatus(id: string, data: any) {
  try {
    const result = await fetchApi(SUBS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidateTag("subscriptions");
    revalidatePath("/admin/subscriptions");
    return result;
  } catch (error) {
    return { success: false };
  }
}

export async function deleteSubscriptionAdmin(id: string) {
  try {
    const result = await fetchApi(SUBS_ENDPOINTS.ADMIN_DELETE(id), {
      method: "DELETE",
    });
    revalidateTag("subscriptions");
    revalidatePath("/admin/subscriptions");
    return result;
  } catch (error) {
    return { success: false };
  }
}

export async function getSubscriptionStats(period = "all") {
  try {
    const data = await fetchApi<{ stats: unknown }>(
      `${SUBS_ENDPOINTS.STATS}?period=${period}`,
    );
    return data.stats;
  } catch (error) {
    return { total: 0, active: 0, expired: 0 };
  }
}

export async function getTotalSubscriptions() {
  try {
    return await fetchApi(SUBS_ENDPOINTS.TOTAL);
  } catch (error) {
    return { total: 0 };
  }
}

export async function triggerManualNotification(data: Record<string, unknown>) {
  try {
    return await fetchApi(SUBS_ENDPOINTS.ADMIN_NOTIFY, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false };
  }
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
