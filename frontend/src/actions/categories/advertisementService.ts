"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { Advertisement } from "@/app/utils/types/advertisement.types";
import { ADVERTISEMENT_ENDPOINTS, AUTH_ENDPOINTS } from "../constant/constant";

const addCacheBuster = (url: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

async function getSessionUserId(): Promise<string> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(AUTH_ENDPOINTS.VERIFY_SESSION, {
      method: "POST",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data?.user?.id || data?.user?._id || "";
  } catch {
    return "";
  }
}

export const getAdvertisements = async (
  position?: string,
  limit?: number,
): Promise<Advertisement[]> => {
  const url = new URL(ADVERTISEMENT_ENDPOINTS.GET_ALL);
  if (position) url.searchParams.append("position", position);
  if (limit) url.searchParams.append("limit", limit.toString());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
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
  } catch {
    return null;
  }
};

export const getAdvertisementStats = async (): Promise<Record<
  string,
  unknown
> | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.STATS, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
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
): Promise<Record<string, unknown>> => {
  try {
    const headers = await getAuthHeaders(accessToken);
    const userId = (data as any).userId || (await getSessionUserId());
    const { id: _omit, isActive: _ia, ...rest } = data as any;
    const payload = { ...rest, userId };
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.CREATE, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const result = await response.json();
    return result;
  } catch {
    return { success: false };
  }
};

export const updateAdvertisement = async (
  id: string,
  data: Partial<Advertisement>,
  accessToken?: string,
): Promise<Record<string, unknown>> => {
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
    return result;
  } catch {
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
    return true;
  } catch {
    return false;
  }
};

export const getAdStats = async (): Promise<{ totalAds: number } | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(ADVERTISEMENT_ENDPOINTS.STATS, {
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return { totalAds: data?.totalAds ?? 0 };
  } catch {
    return null;
  }
};
