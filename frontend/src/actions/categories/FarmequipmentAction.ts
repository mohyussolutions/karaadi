"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { apiUrlsForCategoryTotals } from "../constant/constant";
import type { FarmEquipment } from "@/app/utils/types/farmequipment.types";

interface PaginatedResponse {
  data: FarmEquipment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export async function getAllFarmEquipment(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${apiUrlsForCategoryTotals.TraktorsAdmin}?page=${page}&limit=${limit}`,
    {
      headers: headers as HeadersInit,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return { data: [], total: 0, page: 1, limit, hasMore: false };
  }

  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.data || [];
  const total = data?.total || list.length;

  return {
    data: list.map((item: any) => ({
      ...item,
      _id: item._id || item.id || "",
    })),
    total,
    page,
    limit,
    hasMore: page * limit < total,
  };
}

export async function getFarmequipment(page = 1, pageSize = 20): Promise<FarmEquipment[]> {
  const res = await fetch(`${apiUrlsForCategoryTotals.Traktors}?page=${page}&pageSize=${pageSize}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.data || [];
  return list.map((item: any) => ({ ...item, _id: item._id || item.id || "" }));
}

export async function getFarmEquipmentById(
  id: string,
): Promise<FarmEquipment | null> {
  const res = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const item = await res.json();
  return { ...item, _id: item._id || item.id || "" };
}

export async function createTraktor(
  data: Partial<FarmEquipment>,
  token?: string,
): Promise<{ success: boolean; _id?: string; message?: string }> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.Traktors, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok) {
    return { success: false, message: result.message || "Failed to create" };
  }
  const item = result.data || result;
  return { success: true, _id: item.id || item._id || "" };
}

export async function updateTraktor(
  id: string,
  data: Partial<FarmEquipment>,
  token?: string,
): Promise<{ success: boolean; message?: string }> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.message || "Update failed" };
  }
  return { success: true };
}

export async function deleteTraktor(
  id: string,
  token?: string,
): Promise<{ success: boolean; message?: string }> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.message || "Delete failed" };
  }
  return { success: true };
}

export async function getFarmEquipmentTotal(): Promise<number> {
  const headers = await getAuthHeaders();
  const res = await fetch(apiUrlsForCategoryTotals.TotalFarmEquipment, {
    headers: headers as HeadersInit,
    next: { revalidate: 60 },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.totalFarmEquipment || 0;
}

export async function toggleFarmEquipmentPaymentAction(
  id: string,
  currentStatus: boolean,
  token?: string,
): Promise<{ success: boolean; message?: string }> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(
    `${apiUrlsForCategoryTotals.Traktors}/${id}/payment`,
    {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.message || "Update failed" };
  }
  return { success: true };
}
