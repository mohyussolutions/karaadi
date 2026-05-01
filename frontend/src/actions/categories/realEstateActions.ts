"use server";

import { REAL_ESTATE_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { RealEstate } from "@/app/utils/types/realestate.types";

export async function getTotalRealEstateCount(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(REAL_ESTATE_ENDPOINTS.TOTAL, {
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const result = await res.json();
    return result.totalRealEstates || result.count || result.total || 0;
  } catch {
    return 0;
  }
}
export async function getRealEstateById(
  id: string,
): Promise<RealEstate | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(REAL_ESTATE_ENDPOINTS.BY_ID(id), {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const result = await res.json();
  return result
    ? { ...result, _id: result._id || result.id, id: result.id || result._id }
    : null;
}

export async function getRealEstateListings(page = 1, pageSize = 20): Promise<RealEstate[]> {
  const res = await fetch(`${REAL_ESTATE_ENDPOINTS.BASE}?page=${page}&pageSize=${pageSize}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const result = await res.json();
  const data = Array.isArray(result) ? result : (result?.data ?? []);

  return data.map((it: RealEstate) => {
    const resolvedId = String(it._id ?? it.id ?? "");
    return { ...it, _id: resolvedId, id: resolvedId };
  });
}

export async function fetchAdminRealEstate(): Promise<RealEstate[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(REAL_ESTATE_ENDPOINTS.ADMIN_ALL, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : (data?.data ?? []);
}

export async function getAllRealEstatesAdmin(
  page = 1,
  pageSize = 20,
): Promise<{ data: RealEstate[]; hasMore: boolean; page: number }> {
  const headers = await getAuthHeaders();
  const url = `${REAL_ESTATE_ENDPOINTS.ADMIN_ALL}?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) return { data: [], hasMore: false, page };
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data?.data ?? []);
  const hasMore = arr.length === pageSize;
  return { data: arr, hasMore, page };
}

export async function toggleRealEstatePaidAction(
  id: string,
  currentStatus: boolean,
): Promise<{ success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${REAL_ESTATE_ENDPOINTS.BASE}/${id}/payment`, {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify({ isPaid: !currentStatus }),
    cache: "no-store",
  });
  return { success: res.ok };
}

export async function updatePaidStatus(
  id: string,
  isPaid: boolean,
): Promise<{ message: string; success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${REAL_ESTATE_ENDPOINTS.BASE}/${id}/payment`, {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify({ isPaid }),
    cache: "no-store",
  });
  let message = "";
  try {
    const result = await res.json();
    message = result?.message || (res.ok ? "Success" : "Failed");
  } catch {
    message = res.ok ? "Success" : "Failed";
  }
  return { success: res.ok, message };
}

export async function deleteRealEstate(
  id: string,
): Promise<{ message: string; success: boolean }> {
  const headers = await getAuthHeaders();
  const res = await fetch(REAL_ESTATE_ENDPOINTS.BY_ID(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
    cache: "no-store",
  });
  let message = "";
  try {
    const result = await res.json();
    message = result?.message || (res.ok ? "Deleted" : "Delete failed");
  } catch {
    message = res.ok ? "Deleted" : "Delete failed";
  }
  return { success: res.ok, message };
}

export async function createRealEstate(
  data: Partial<RealEstate>,
  token?: string,
): Promise<{ success: boolean; id?: string; message?: string }> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(REAL_ESTATE_ENDPOINTS.BASE, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok) return { success: false, message: result.error === "Validation failed" ? result.message : (result.message || result.error || "Failed") };
  return { success: true, id: result.id || result._id };
}
