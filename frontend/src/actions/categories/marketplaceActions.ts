"use server";

import {
  apiUrlsForCategoryTotals,
  PAYMENT_ENDPOINTS,
} from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export async function getMarketplaceItems() {
  const res = await fetch(apiUrlsForCategoryTotals.Marketplace, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];
  const result = await res.json();
  const list = Array.isArray(result) ? result : (result?.data ?? []);

  return list.map((it: any) => ({
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it._id ?? it.id ?? ""),
  }));
}

export async function getMarketplaceItemById(id: string) {
  const res = await fetch(`${apiUrlsForCategoryTotals.Marketplace}/${id}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) return null;
  const it = await res.json();
  return {
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it._id ?? it.id ?? ""),
  };
}

export async function getAdminMarketplaceItems(
  token?: string,
  page = 1,
  pageSize = 10,
) {
  const headers = await getAuthHeaders(token);
  const url = `${apiUrlsForCategoryTotals.allIncludingUnpaid}?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    headers: headers as HeadersInit,
    cache: "no-store",
  });

  if (!res.ok) return [];
  const result = await res.json();
  const list = Array.isArray(result) ? result : (result?.data ?? []);

  return list.map((it: any) => ({
    ...it,
    _id: String(it._id ?? it.id ?? ""),
    id: String(it._id ?? it.id ?? ""),
  }));
}

export async function deleteAdminMarketplaceItem(
  itemId: string,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.DeleteItem(itemId), {
    method: "DELETE",
    headers: headers as HeadersInit,
  });
  return res.ok;
}

export async function updateAdminMarketplaceItemPaidStatus(
  itemId: string,
  isPaid: boolean,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.UpdateItem(itemId), {
    method: "PATCH",
    headers: headers as HeadersInit,
    body: JSON.stringify({ isPaid }),
  });
  return res.ok;
}

function stripUndefined(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stripUndefined);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== "$undefined" && v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)]),
    );
  }
  return obj === "$undefined" ? undefined : obj;
}

export async function createMarketplaceItem(data: any, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.Marketplace, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(stripUndefined(data)),
  });

  const result = await res.json();
  return res.ok
    ? { success: true, id: result._id || result.id }
    : { success: false, error: result.message };
}

export async function updateMarketplaceItem(
  id: string,
  data: any,
  token?: string,
) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.UpdateItem(id), {
    method: "PUT",
    headers: headers as HeadersInit,
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return res.ok
    ? { success: true, id: result._id || result.id }
    : { success: false, message: result.message || result.error || "Failed" };
}

export async function deleteMarketplaceItem(id: string, token?: string) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrlsForCategoryTotals.DeleteItem(id), {
    method: "DELETE",
    headers: headers as HeadersInit,
  });
  return res.ok;
}

export async function getItemDetailAction(id: string) {
  const res = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
    cache: "no-store",
  });
  return res.ok ? res.json() : null;
}

export async function getTotalMarketplaceItemsCount() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.TotalMarketplace, {
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const result = await res.json();
    return result.count || result.totalMarketplaceItems || result.total || 0;
  } catch {
    return 0;
  }
}
