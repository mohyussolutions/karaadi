"use server";

import {
  CreatePaymentData,
  Payment,
  PaginatedPayments,
  UpdatePaymentStatusData,
  PaymentStats,
} from "../../app/utils/types/payment";
import { PAYMENT_ENDPOINTS } from "../constant/constant";

export async function createPaymentAction(
  data: CreatePaymentData,
): Promise<Payment> {
  const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment: data }),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed");

  return result.data;
}

export async function getAllPaymentsAction(
  params?: any,
): Promise<PaginatedPayments> {
  const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value.toString());
    });
  }

  const response = await fetch(url.toString(), {
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
}

export async function getPaymentStatsAction(
  params?: any,
): Promise<PaymentStats> {
  const url = new URL(PAYMENT_ENDPOINTS.STATS);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value.toString());
    });
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) {
    return { totalRevenue: 0, paymentCount: 0 } as unknown as PaymentStats;
  }

  return result.data;
}

export async function updatePaymentStatusAction(
  id: string,
  data: UpdatePaymentStatusData,
): Promise<Payment> {
  const response = await fetch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to update");

  return result.data;
}

export async function deletePaymentAction(id: string) {
  const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
    method: "DELETE",
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Delete failed");

  return result;
}

export async function searchPaymentsAction(query: string): Promise<Payment[]> {
  const url = new URL(PAYMENT_ENDPOINTS.SEARCH);
  url.searchParams.append("query", query);

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  const result = await response.json();
  return result.data || [];
}

export async function getItemDetailAction(id: string) {
  const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to fetch detail");

  return result;
}
