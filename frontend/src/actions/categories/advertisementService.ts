"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { ADVERTISEMENT_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

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

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export const getAdvertisements = async (
  position?: string,
  limit?: number,
): Promise<Advertisement[]> => {
  const url = new URL(addCacheBuster(ADVERTISEMENT_ENDPOINTS.GET_ALL));
  if (position) url.searchParams.append("position", position);
  if (limit) url.searchParams.append("limit", limit.toString());

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(url.toString(), {
      headers: headers as HeadersInit,
      cache: "no-store",
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
    const headers = await getAuthHeaders();
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.GET_BY_ID(id)),
      {
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const getAdvertisementStats = async (): Promise<any> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.STATS),
      {
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const trackAdClick = async (adId: string): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    await fetch(addCacheBuster(ADVERTISEMENT_ENDPOINTS.CLICK(adId)), {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Failed to track ad click:", error);
  }
};

export const createAdvertisement = async (
  data: Partial<Advertisement>,
  accessToken?: string,
): Promise<any> => {
  try {
    const headers = await getAuthHeaders(accessToken);
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.CREATE),
      {
        method: "POST",
        headers: headers as HeadersInit,
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
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
  accessToken?: string,
): Promise<any> => {
  try {
    const headers = await getAuthHeaders(accessToken);
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.UPDATE(id)),
      {
        method: "PUT",
        headers: headers as HeadersInit,
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );
    const result = await response.json();
    revalidateTag("ads");
    revalidateTag(`ad-${id}`);
    revalidatePath("/");
    return result;
  } catch (error) {
    return { success: false };
  }
};

export const deleteAdvertisement = async (
  id: string,
  accessToken?: string,
): Promise<boolean> => {
  try {
    const headers = await getAuthHeaders(accessToken);
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.DELETE(id)),
      {
        method: "DELETE",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
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
    const headers = await getAuthHeaders();
    const response = await fetch(
      addCacheBuster(ADVERTISEMENT_ENDPOINTS.STATS),
      {
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};
