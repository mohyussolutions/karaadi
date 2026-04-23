"use server";

import { PAYMENT_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import {
  Payment,
  PaymentStats,
  CreatePaymentData,
  UpdatePaymentStatusData,
  PaginatedPayments,
} from "@/app/utils/types/payment";

export async function createPayment(data: CreatePaymentData): Promise<Payment> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify({ payment: data }),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Payment failed");
  return result.data;
}

export async function getAllPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
}): Promise<PaginatedPayments> {
  const headers = await getAuthHeaders();
  const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);
  if (params?.page) url.searchParams.append("page", params.page.toString());
  if (params?.limit) url.searchParams.append("limit", params.limit.toString());
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.paymentMethod)
    url.searchParams.append("paymentMethod", params.paymentMethod);

  try {
    const response = await fetch(url.toString(), {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    const result = await response.json();
    return response.ok
      ? {
          items: result.data?.payments || [],
          total: result.data?.total || 0,
          page: result.data?.page || 1,
          limit: result.data?.limit || 20,
        }
      : { items: [], total: 0, page: 1, limit: 20 };
  } catch {
    return { items: [], total: 0, page: 1, limit: 20 };
  }
}

export async function getPaymentStats(
  params?: Record<string, string | number | boolean>,
): Promise<PaymentStats> {
  const headers = await getAuthHeaders();
  const url = new URL(PAYMENT_ENDPOINTS.STATS);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  const response = await fetch(url.toString(), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  const result = await response.json();
  return response.ok ? result.data : { totalRevenue: 0, paymentCount: 0 };
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.GET_BY_ID(id), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.data;
}

export async function updatePaymentStatus(
  id: string,
  data: UpdatePaymentStatusData,
): Promise<Payment> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Update failed");
  return result.data;
}

export async function deletePayment(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Delete failed");
  return { success: true, message: result.message || "Payment deleted" };
}

export async function searchPayments(query: string): Promise<Payment[]> {
  const headers = await getAuthHeaders();
  const url = new URL(PAYMENT_ENDPOINTS.SEARCH);
  url.searchParams.append("query", query);
  const response = await fetch(url.toString(), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  const result = await response.json();
  return result.data || [];
}

export async function getItemDetail(
  id: string,
): Promise<Record<string, unknown>> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to fetch detail");
  return result;
}

export async function getMyPayments(): Promise<Payment[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(PAYMENT_ENDPOINTS.GET_MY_PAYMENTS, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!response.ok) return [];
  const result = await response.json();

  if (result.success && Array.isArray(result.data)) {
    return result.data.map((it: Payment) => ({
      ...it,
      id: String(it.id ?? it._id ?? ""),
    }));
  }
  return [];
}
