"use server";

import { apiUrlsForCategoryTotals } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { Motorcycle } from "@/app/utils/types/motorcycles.types";

export async function getMotorcycles(page = 1, pageSize = 20): Promise<Motorcycle[]> {
  const res = await fetch(
    `${apiUrlsForCategoryTotals.Motorcycles}?page=${page}&pageSize=${pageSize}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) return [];
  const result = await res.json();
  const list = Array.isArray(result) ? result : result?.data || [];

  return list.map((it: any) => ({
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it.id ?? it._id ?? ""),
  })) as Motorcycle[];
}

export async function getMotorcycleById(
  id: string,
): Promise<Motorcycle | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
    headers: headers as HeadersInit,
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const it = await res.json();
  return {
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it.id ?? it._id ?? ""),
  } as Motorcycle;
}

export async function createMotorcycle(
  data: Record<string, unknown>,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await res.json();
  return res.ok
    ? { success: true, motorcycleId: result.id || result._id }
    : { success: false, message: result?.message || result?.error || "Failed" };
}

export async function updateMotorcycle(
  id: string,
  data: Record<string, unknown>,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await res.json();
  return res.ok
    ? { success: true, motorcycleId: id }
    : { success: false, message: result?.message || result?.error || "Failed" };
}

export async function deleteMotorcycle(id: string, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  return { success: res.ok };
}

export async function getTotalMotorcyclesAction(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.TotalMotorcycles, {
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalMotorcycles ?? data.count ?? data.total ?? 0;
  } catch {
    return 0;
  }
}

export async function getAllMotorcyclesAdminAction(
  page = 1,
  pageSize = 20,
): Promise<Motorcycle[]> {
  const headers = await getAuthHeaders();
  const url = `${apiUrlsForCategoryTotals.MotorcyclesAdmin}?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!res.ok) return [];
  const result = await res.json();
  const list = Array.isArray(result) ? result : result.data || [];
  return list as Motorcycle[];
}

export async function toggleMotorcyclePaidAction(
  id: string,
  currentStatus: boolean,
) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${apiUrlsForCategoryTotals.Motorcycles}/${id}/payment`,
    {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    },
  );

  return { success: res.ok };
}

export async function deleteMotorcycleAction(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  return { success: res.ok };
}
