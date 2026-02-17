"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment: data }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed");

    revalidateTag("payments-list");
    revalidateTag("payment-stats");
    revalidatePath("/dashboard/payments");

    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllPaymentsAction(
  params?: any,
): Promise<PaginatedPayments> {
  try {
    const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 30, tags: ["payments-list"] },
    });

    const result = await response.json();
    if (!response.ok) throw new Error();

    return result.data;
  } catch {
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
    const url = new URL(PAYMENT_ENDPOINTS.STATS);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      next: { revalidate: 60, tags: ["payment-stats"] },
    });

    const result = await response.json();
    return result.data;
  } catch {
    return { totalRevenue: 0, paymentCount: 0 } as unknown as PaymentStats;
  }
}

export async function updatePaymentStatusAction(
  id: string,
  data: UpdatePaymentStatusData,
): Promise<Payment> {
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error();

    revalidateTag("payments-list");
    revalidateTag("payment-stats");
    revalidateTag(`payment-${id}`);

    return result.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deletePaymentAction(id: string) {
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) throw new Error();

    revalidateTag("payments-list");
    revalidateTag("payment-stats");
    revalidatePath("/dashboard/payments");
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function searchPaymentsAction(query: string): Promise<Payment[]> {
  try {
    const url = new URL(PAYMENT_ENDPOINTS.SEARCH);
    url.searchParams.append("query", query);

    const response = await fetch(url.toString(), { cache: "no-store" });
    const result = await response.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export async function getItemDetailAction(id: string) {
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
      method: "GET",
      next: { revalidate: 300, tags: [`item-detail-${id}`] },
    });
    const result = await response.json();
    if (!response.ok) throw new Error();
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
