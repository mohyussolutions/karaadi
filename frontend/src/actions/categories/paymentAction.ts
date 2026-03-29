"use server";

import { PAYMENT_ENDPOINTS } from "../constant/constant";
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export type Payment = {
  id: string;
  totalAmount: number;
  planAmount?: number;
  feeAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string | null;
  boatId?: string | null;
  carId?: string | null;
  marketplaceId?: string | null;
  realEstateId?: string | null;
  motorcycleId?: string | null;
  farmequipmentId?: string | null;
  jobId?: string | null;
  subscriptionId?: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
    phone?: string;
  };
};

export type PaymentStats = {
  summary: {
    totalAmount: number;
    totalPayments: number;
    averagePayment: number;
    minPayment: number;
    maxPayment: number;
    totalTax: number;
    totalPlatformFee: number;
    totalFee: number;
  };
  breakdown: {
    status: Array<{
      status: string;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
    paymentMethods: Array<{
      paymentMethod: string;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
  };
};

export async function createPayment(paymentData: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify({ payment: paymentData }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Payment failed",
        key: result.key,
        responseCode: result.responseCode,
      };
    }

    revalidatePath("/payments");
    revalidatePath("/my-payments");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      success: false,
      message: "Network error",
    };
  }
}

export async function getAllPayments(params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
}): Promise<{ payments: Payment[]; total: number }> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);

    if (params?.page) url.searchParams.append("page", params.page.toString());
    if (params?.limit)
      url.searchParams.append("limit", params.limit.toString());
    if (params?.status) url.searchParams.append("status", params.status);
    if (params?.paymentMethod)
      url.searchParams.append("paymentMethod", params.paymentMethod);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return { payments: [], total: 0 };

    const result = await response.json();
    return {
      payments: result.data?.payments || [],
      total: result.data?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return { payments: [], total: 0 };
  }
}

export async function deletePayment(id: string) {
  try {
    const headers = await getAuthHeaders();

    if (!headers.Authorization) {
      return { success: false, message: "Authentication required" };
    }

    const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Delete failed",
      };
    }

    revalidatePath("/admin/payments");
    revalidatePath("/my-payments");

    return {
      success: true,
      message: result.message || "Payment deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Network error" };
  }
}

export async function getPaymentStats(): Promise<PaymentStats | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.STATS, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    return null;
  }
}

export async function getMyPayments(): Promise<Payment[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.GET_MY_PAYMENTS, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch my payments: ${response.status}`);
      return [];
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data.map((item: any) => ({
        ...item,
        id: item.id,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching my payments:", error);
    return [];
  }
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.GET_BY_ID(id), {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching payment by id:", error);
    return null;
  }
}

export async function updatePaymentStatus(
  id: string,
  status: string,
  transactionId?: string,
) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ status, transactionId }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Update failed",
      };
    }

    revalidatePath("/admin/payments");
    revalidatePath(`/payments/${id}`);

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, message: "Network error" };
  }
}

export async function searchPayments(query: string): Promise<Payment[]> {
  try {
    const headers = await getAuthHeaders();
    const url = new URL(PAYMENT_ENDPOINTS.SEARCH);
    url.searchParams.append("query", query);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return [];

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error searching payments:", error);
    return [];
  }
}

export async function getItemDetail(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error fetching item detail:", error);
    return null;
  }
}

export const getTotalTransactions = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(PAYMENT_ENDPOINTS.TRANSACTIONS, {
      method: "GET",
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return 0;

    const data = await res.json();
    return data.totalTransactions ?? 0;
  } catch (error) {
    console.error("Failed to fetch total transactions:", error);
    return 0;
  }
};
