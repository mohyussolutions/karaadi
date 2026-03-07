"use server";
import {
  apiUrlsForCategoryTotals,
  PAYMENT_ENDPOINTS,
} from "../constant/constant";
import { cookies } from "next/headers";
export type MarketplaceItem = {
  _id: string;
  id: string;
  user: string;
  title: string;
  so?: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  region: string;
  city: string;
  images: string[];
  extra?: object;
  isPaid?: boolean;
};

export interface AdminMarketplaceItem {
  id: string;
  _id: string;
  title: string;
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  price: number;
  city: string;
  images: string[];
  isPaid: boolean;
  user?: {
    username: string;
    email: string;
    phone: string;
  };
}

export type CreateMarketplaceData = Omit<
  MarketplaceItem,
  "_id" | "id" | "user"
>;

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Marketplace}?paid=true`,
    {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  const itemList = Array.isArray(result) ? result : (result?.data ?? []);

  return itemList.map((item: any) => ({
    ...item,
    _id: item._id || item.id,
    id: item._id || item.id,
  }));
}

export async function getMarketplaceItemById(
  id: string,
): Promise<MarketplaceItem | null> {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return null;
  const item = await response.json();
  return {
    ...item,
    _id: item._id || item.id,
    id: item._id || item.id,
  } as MarketplaceItem;
}

export async function getAdminMarketplaceItems(
  token?: string,
): Promise<AdminMarketplaceItem[]> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(apiUrlsForCategoryTotals.allIncludingUnpaid, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) return [];
  const data = await response.json();
  const items = Array.isArray(data) ? data : (data?.data ?? []);

  return items.map((item: any) => ({
    ...item,
    id: item._id || item.id,
    _id: item._id || item.id,
  }));
}

export async function deleteAdminMarketplaceItem(
  itemId: string,
  token?: string,
): Promise<boolean> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(apiUrlsForCategoryTotals.DeleteItem(itemId), {
    method: "DELETE",
    headers,
  });

  return response.ok;
}

export async function updateAdminMarketplaceItemPaidStatus(
  itemId: string,
  isPaid: boolean,
  token?: string,
): Promise<boolean> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(apiUrlsForCategoryTotals.UpdateItem(itemId), {
    method: "PATCH",
    headers,
    body: JSON.stringify({ isPaid }),
  });

  return response.ok;
}

export async function createMarketplaceItem(
  data: CreateMarketplaceData,
  token?: string,
) {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(apiUrlsForCategoryTotals.Marketplace, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) return { success: false, error: result.message };

  return {
    success: true,
    id: result._id || result.id,
  };
}

export async function updateMarketplaceItem(
  id: string,
  data: Partial<CreateMarketplaceData>,
  token: string,
) {
  const response = await fetch(apiUrlsForCategoryTotals.UpdateItem(id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) return { success: false, message: result.message };

  return { success: true, id: result._id || result.id };
}

export async function deleteMarketplaceItem(
  id: string,
  token?: string,
): Promise<boolean> {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(apiUrlsForCategoryTotals.DeleteItem(id), {
    method: "DELETE",
    headers,
  });

  return response.ok;
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

export async function getTotalMarketplaceItemsCount() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("idToken")?.value ||
      cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrlsForCategoryTotals.TotalMarketplace, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch total: ${response.status}`);
      return 0;
    }

    const result = await response.json();
    return result.count || result.totalMarketplaceItems || result.total || 0;
  } catch (error) {
    console.error("Error fetching marketplace items count:", error);
    return 0;
  }
}
