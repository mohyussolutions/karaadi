"use server";

import {
  apiUrlsForCategoryTotals,
  PAYMENT_ENDPOINTS,
} from "../constant/constant";

export type MarketplaceItem = {
  _id: string;
  user: string;
  title: string;
  so?: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string;
  subcategory: string;
  region: string;
  city: string;
  images: string[];
  extra?: object;
};

type CreateMarketplaceData = Omit<MarketplaceItem, "_id" | "user">;

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Marketplace}?paid=true`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return [];
  const result = await response.json();
  const itemList = Array.isArray(result) ? result : (result?.data ?? []);

  return itemList.map((item: any) => ({
    ...item,
    _id: item._id || item.id,
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
  } as MarketplaceItem;
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
    message: "Item created successfully.",
    id: result._id || result.id,
  };
}

export async function updateMarketplaceItem(
  id: string,
  data: Partial<CreateMarketplaceData>,
  token: string,
) {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) return { success: false, message: result.message };

  return { success: true, message: "Item updated.", id: result.id };
}

export async function deleteMarketplaceItem(id: string, token: string) {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) return { success: false, message: "Delete failed." };

  return { success: true, message: "Item deleted." };
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
