"use server";

import {
  CreatePaymentData,
  Payment,
  PaginatedPayments,
  UpdatePaymentStatusData,
  PaymentStats,
} from "../../app/utils/types/payment";
import { PAYMENT_ENDPOINTS } from "../constant/constant";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export async function createPaymentAction(
  data: CreatePaymentData,
): Promise<Payment> {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(PAYMENT_ENDPOINTS.CREATE);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ payment: data }),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed");

    revalidateTag("payments");
    revalidatePath("/admin/payments");
    return result.data;
  } catch (error) {
    console.error("Create payment error:", error);
    throw error;
  }
}

export async function getAllPaymentsAction(
  params?: any,
): Promise<PaginatedPayments> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(addCacheBuster(PAYMENT_ENDPOINTS.GET_ALL));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
      } as unknown as PaginatedPayments;
    }

    return result.data;
  } catch (error) {
    console.error("Get all payments error:", error);
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
    } as unknown as PaginatedPayments;
  }
}

export async function getPaymentStatsAction(
  params?: any,
): Promise<PaymentStats> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(addCacheBuster(PAYMENT_ENDPOINTS.STATS));

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) {
      return { totalRevenue: 0, paymentCount: 0 } as unknown as PaymentStats;
    }

    return result.data;
  } catch (error) {
    console.error("Get payment stats error:", error);
    return { totalRevenue: 0, paymentCount: 0 } as unknown as PaymentStats;
  }
}

export async function updatePaymentStatusAction(
  id: string,
  data: UpdatePaymentStatusData,
): Promise<Payment> {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(PAYMENT_ENDPOINTS.UPDATE_STATUS(id));

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to update");

    revalidateTag("payments");
    revalidateTag(`payment-${id}`);
    revalidatePath("/admin/payments");
    return result.data;
  } catch (error) {
    console.error("Update payment status error:", error);
    throw error;
  }
}

export async function deletePaymentAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(PAYMENT_ENDPOINTS.DELETE(id));

    const response = await fetch(url, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Delete failed");

    revalidateTag("payments");
    revalidatePath("/admin/payments");
    return result;
  } catch (error) {
    console.error("Delete payment error:", error);
    throw error;
  }
}

export async function searchPaymentsAction(query: string): Promise<Payment[]> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(addCacheBuster(PAYMENT_ENDPOINTS.SEARCH));
    url.searchParams.append("query", query);

    const response = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Search payments error:", error);
    return [];
  }
}

export async function getItemDetailAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id));

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to fetch detail");

    return result;
  } catch (error) {
    console.error("Get item detail error:", error);
    throw error;
  }
}
