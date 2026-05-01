"use server";

import { apiUrlsForCategoryTotals } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import {
  BoatItem,
  CreateBoatPayload,
  CreateBoatData,
} from "../../app/utils/types/boats.types";

export async function getBoats(page = 1, pageSize = 20): Promise<BoatItem[] | null> {
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}?page=${page}&pageSize=${pageSize}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const result = await res.json();
  const list = Array.isArray(result) ? result : [];

  return list.map((item: any) => ({
    id: String(item.id ?? item._id ?? ""),
    title: String(item.title ?? item.name ?? ""),
    name: String(item.name ?? item.title ?? ""),
    type: "boat",
    category: Array.isArray(item.category)
      ? item.category
      : [String(item.category ?? "")],
    subcategory: item.subcategory,
    region: String(item.region ?? ""),
    city: String(item.city ?? ""),
    description: String(item.description ?? ""),
    price: Number(item.price ?? 0),
    images: Array.isArray(item.images) ? item.images : [],
    image: item.images?.[0],
    boatModel: String(item.boatModel ?? ""),
    transmission: String(item.transmission ?? ""),
    color: String(item.color ?? ""),
    ownerId: String(item.userId ?? item.ownerId ?? ""),
    userId: item.userId,
    createdAt: String(item.createdAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
    status: item.status,
    length: item.length,
    year: item.year,
    priority: item.priority,
    isPaid: Boolean(item.isPaid),
    isBasic30: Boolean(item.isBasic30),
    isStandard60: Boolean(item.isStandard60),
    isPremium90: Boolean(item.isPremium90),
    maGaday: Boolean(item.maGaday),
    expiryDate: item.expiryDate ?? null,
    feeId: item.feeId ?? null,
    feeAmount: Number(item.feeAmount ?? 0),
    planId: item.planId ?? null,
    planAmount: Number(item.planAmount ?? 0),
  }));
}

export async function getBoatById(id: string): Promise<BoatItem | null> {
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) return null;
  const item = await res.json();

  return {
    id: String(item.id ?? item._id ?? ""),
    title: String(item.title ?? item.name ?? ""),
    name: String(item.name ?? item.title ?? ""),
    type: "boat",
    category: Array.isArray(item.category)
      ? item.category
      : [String(item.category ?? "")],
    subcategory: item.subcategory,
    region: String(item.region ?? ""),
    city: String(item.city ?? ""),
    description: String(item.description ?? ""),
    price: Number(item.price ?? 0),
    images: Array.isArray(item.images) ? item.images : [],
    image: item.images?.[0],
    boatModel: String(item.boatModel ?? ""),
    transmission: String(item.transmission ?? ""),
    color: String(item.color ?? ""),
    ownerId: String(item.userId ?? item.ownerId ?? ""),
    userId: item.userId,
    createdAt: String(item.createdAt ?? ""),
    updatedAt: String(item.updatedAt ?? ""),
    status: item.status,
    length: item.length,
    year: item.year,
    priority: item.priority,
    isPaid: Boolean(item.isPaid),
    isBasic30: Boolean(item.isBasic30),
    isStandard60: Boolean(item.isStandard60),
    isPremium90: Boolean(item.isPremium90),
    maGaday: Boolean(item.maGaday),
    expiryDate: item.expiryDate ?? null,
    feeId: item.feeId ?? null,
    feeAmount: Number(item.feeAmount ?? 0),
    planId: item.planId ?? null,
    planAmount: Number(item.planAmount ?? 0),
  };
}

export async function createBoat(payload: CreateBoatPayload, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.Boats, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return res.ok
    ? { success: true, boatId: result._id || result.id }
    : { success: false, message: result.message || result.error || "Failed" };
}

export async function updateBoat(
  id: string,
  data: Partial<CreateBoatData>,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
  });

  return res.ok ? { success: true, boatId: id } : { success: false };
}

export async function updateBoatPayment(
  boatId: string,
  paymentId: string,
  planId: string,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(
    `${apiUrlsForCategoryTotals.Boats}/${boatId}/payment`,
    {
      method: "PUT",
      headers: headers as HeadersInit,
      body: JSON.stringify({ paymentId, planId }),
    },
  );

  const data = await res.json();
  return res.ok
    ? { success: true, data }
    : { success: false, message: data.message };
}

export async function deleteBoat(id: string, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
  });

  return res.ok ? { success: true } : { success: false };
}

export async function getTotalBoatsAction(token?: string): Promise<number> {
  try {
    const headers = await getAuthHeaders(token);
    const res = await fetch(apiUrlsForCategoryTotals.TotalBoats, {
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalBoats || data.count || data.total || 0;
  } catch {
    return 0;
  }
}

export async function getAllBoatsAdminAction(
  token?: string,
  pageNum = 1,
  sizeNum = 20,
) {
  const headers = await getAuthHeaders(token);
  const url = `${apiUrlsForCategoryTotals.BoatsAdmin}?pageNum=${pageNum}&sizeNum=${sizeNum}`;
  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : (data?.data ?? []);

  return list.map((item: any) => ({
    ...item,
    _id: String(item._id ?? item.id ?? ""),
    id: String(item._id ?? item.id ?? ""),
  }));
}

export async function toggleBoatPaymentAction(
  id: string,
  currentStatus: boolean,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}/payment`, {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify({ isPaid: !currentStatus }),
  });

  return { success: res.ok };
}

export async function deleteBoatAction(id: string, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
    method: "DELETE",
    headers: headers as HeadersInit,
  });

  return { success: res.ok };
}
