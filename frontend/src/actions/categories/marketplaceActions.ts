"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type MarketplaceItem = {
  _id: string;
  user: string;
  title: string;
  so?: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict?: string;
  images: string[];
  extra?: object;
};

type CreateMarketplaceData = {
  title: string;
  so?: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict?: string;
  images: string[];
  extra?: object;
};

export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Marketplace, {
      method: "GET",
      next: { tags: ["marketplace-items"], revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const itemList = Array.isArray(result)
      ? result
      : result && result.data && Array.isArray(result.data)
        ? result.data
        : [];

    return itemList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as MarketplaceItem[];
  } catch (error) {
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
        next: { tags: [`marketplace-item-${id}`], revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch marketplace item ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as MarketplaceItem;
  } catch (error) {
    console.error(`Network error fetching marketplace item ${id}:`, error);
    return null;
  }
}

export async function createMarketplaceItem(
  data: CreateMarketplaceData,
  token: string,
) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Marketplace, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message || "Failed to create marketplace item in backend.",
      };
    }

    revalidatePath("/marketplace");
    return {
      success: true,
      message: "Marketplace item created successfully.",
      itemId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
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

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message || "Failed to update marketplace item in backend.",
      };
    }

    revalidatePath(`/marketplace/${id}`);
    revalidatePath("/marketplace");
    return {
      success: true,
      message: "Marketplace item updated successfully.",
      itemId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteMarketplaceItem(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Marketplace}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message:
          result.message || "Failed to delete marketplace item in backend.",
      };
    }

    revalidatePath("/marketplace");
    return { success: true, message: "Marketplace item deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}
