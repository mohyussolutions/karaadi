"use server";

import {
  CreatePaymentData,
  Payment,
  PaginatedPayments,
  UpdatePaymentStatusData,
  PaymentStats,
} from "../../app/utils/types/payment";
import { PAYMENT_ENDPOINTS } from "../constant/constant";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
      headers: headers as HeadersInit,
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
