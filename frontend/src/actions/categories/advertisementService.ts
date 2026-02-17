"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { ADVERTISEMENT_ENDPOINTS } from "../constant/constant";

export interface Advertisement {
  createdAt: string | number | Date;
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  position: string;
  priority: number;
  clicks: number;
  views: number;
  startDate?: Date;
  endDate?: Date;
}

export const getAdvertisements = async (
  position?: string,
  limit?: number,
): Promise<Advertisement[]> => {
  const url = new URL(`${ADVERTISEMENT_ENDPOINTS.GET_ALL}`);
  if (position) url.searchParams.append("position", position);
  if (limit) url.searchParams.append("limit", limit.toString());

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: 300,
        tags: ["ads", `ads-${position || "all"}`],
      },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const getAdvertisementById = async (
  id: string,
): Promise<Advertisement | null> => {
  try {
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.GET_BY_ID(id), {
      next: { revalidate: 600, tags: [`ad-${id}`] },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const trackAdClick = async (adId: string): Promise<void> => {
  try {
    await fetch(ADVERTISEMENT_ENDPOINTS.CLICK(adId), {
      method: "POST",
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to track ad click:", error);
  }
};

export const createAdvertisement = async (
  data: Partial<Advertisement>,
): Promise<any> => {
  try {
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    revalidateTag("ads");
    revalidateTag("ad-stats");
    return result;
  } catch (error) {
    return { success: false };
  }
};

export const updateAdvertisement = async (
  id: string,
  data: Partial<Advertisement>,
): Promise<any> => {
  try {
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.UPDATE(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    revalidateTag("ads");
    revalidateTag(`ad-${id}`);
    revalidatePath("/");
    return result;
  } catch (error) {
    return { success: false };
  }
};

export const deleteAdvertisement = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return false;
    revalidateTag("ads");
    revalidateTag("ad-stats");
    revalidatePath("/");
    return true;
  } catch (error) {
    return false;
  }
};

export const getAdStats = async (): Promise<any> => {
  try {
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.STATS, {
      next: { revalidate: 300, tags: ["ad-stats"] },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};
