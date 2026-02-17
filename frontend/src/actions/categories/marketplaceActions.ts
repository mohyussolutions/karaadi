"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Marketplace}?paid=true`,
      {
        method: "GET",
        next: {
          revalidate: 300,
          tags: ["marketplace-items"],
        },
      },
    );

    if (!response.ok) return [];
    const result = await response.json();
    const itemList = Array.isArray(result) ? result : (result?.data ?? []);

    return itemList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    }));
  } catch {
    return [];
  }
}

export async function getMarketplaceItemById(
  id: string,
): Promise<MarketplaceItem | null> {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
      {
        method: "GET",
        next: {
          revalidate: 600,
          tags: [`marketplace-item-${id}`],
        },
      },
    );

    if (!response.ok) return null;
    const item = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as MarketplaceItem;
  } catch {
    return null;
  }
}

export async function createMarketplaceItem(
  data: CreateMarketplaceData,
  token?: string,
) {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(apiUrlsForCategoryTotals.Marketplace, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) return { success: false, error: result.message };

    revalidateTag("marketplace-items");
    revalidatePath("/marketplace");

    return {
      success: true,
      message: "Item created successfully.",
      id: result._id || result.id,
    };
  } catch {
    return { success: false, error: "Network error." };
  }
}

export async function updateMarketplaceItem(
  id: string,
  data: Partial<CreateMarketplaceData>,
  token: string,
) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    const result = await response.json();
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`marketplace-item-${id}`);
    revalidateTag("marketplace-items");
    revalidatePath(`/marketplace/${id}`);
    revalidatePath("/marketplace");

    return { success: true, message: "Item updated.", id: result.id };
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function deleteMarketplaceItem(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidateTag(`marketplace-item-${id}`);
    revalidateTag("marketplace-items");
    revalidatePath("/marketplace");

    return { success: true, message: "Item deleted." };
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function getItemDetailAction(id: string) {
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.GET_ITEM_DETAIL(id), {
      method: "GET",
      next: {
        revalidate: 60,
        tags: [`item-detail-${id}`],
      },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch item");
  }
}
