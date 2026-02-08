"use server";

import { revalidatePath } from "next/cache";
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
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error || result.message || "Failed to create payment",
    );

  revalidatePath("/dashboard/payments");
  return result.data;
}

export async function getAllPaymentsAction(params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  userId?: string;
  region?: string;
  city?: string;
}): Promise<PaginatedPayments> {
  const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value.toString());
    });
  }

  const response = await fetch(url.toString(), { cache: "no-store" });
  const result = await response.json();

  if (!response.ok) throw new Error(result.error || "Failed to fetch payments");

  return result.data;
}

export async function getPaymentStatsAction(params?: {
  region?: string;
  city?: string;
}): Promise<PaymentStats> {
  const url = new URL(PAYMENT_ENDPOINTS.STATS);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value.toString());
    });
  }

  const response = await fetch(url.toString(), { cache: "no-store" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to fetch stats");

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
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to update status");

  revalidatePath("/dashboard/payments");
  return result.data;
}

export async function deletePaymentAction(id: string) {
  const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
    method: "DELETE",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to delete payment");

  revalidatePath("/dashboard/payments");
  return result;
}

export async function searchPaymentsAction(query: string): Promise<Payment[]> {
  const url = new URL(PAYMENT_ENDPOINTS.SEARCH);
  url.searchParams.append("query", query);

  const response = await fetch(url.toString());
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Search failed");

  return result.data;
}
export async function getItemDetailAction(id: string) {
  const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
    method: "GET",
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to fetch item");
  return result;
}
