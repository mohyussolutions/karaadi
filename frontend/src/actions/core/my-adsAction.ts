"use server";

import { Ad } from "@/app/utils/types/ads";
import { ADS_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const auth = (t?: string) => getAuthHeaders(t) as Promise<HeadersInit>;

export const getMyAds = async (accessToken?: string): Promise<Ad[]> => {
  try {
    const res = await fetch(ADS_ENDPOINTS.MY_ADS, {
      method: "GET",
      headers: await auth(accessToken),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const raw = await res.json();
    return (Array.isArray(raw) ? raw : (raw?.data ?? [])).map((a: any) => ({
      id: String(a.id ?? a._id ?? ""),
      title: String(a.title ?? ""),
      description: String(a.description ?? ""),
      price: Number(a.price ?? 0),
      maGaday: !!a.maGaday,
      isPaid: !!a.isPaid,
      image: String(a.images?.[0] ?? a.image ?? ""),
      type: String(a.type ?? "marketplace"),
    }));
  } catch {
    return [];
  }
};

export const getMyAdById = async (
  id: string,
  accessToken?: string,
): Promise<Ad | null> => {
  try {
    const res = await fetch(`${ADS_ENDPOINTS.ADS_BASE}/${id}`, {
      method: "GET",
      headers: await auth(accessToken),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const a = await res.json();
    return {
      id: String(a.id ?? a._id ?? ""),
      title: String(a.title ?? ""),
      description: String(a.description ?? ""),
      price: Number(a.price ?? 0),
      maGaday: !!a.maGaday,
      isPaid: !!a.isPaid,
      image: String(a.images?.[0] ?? a.image ?? ""),
      type: String(a.type ?? "marketplace"),
    } as Ad;
  } catch {
    return null;
  }
};

export const updateAd = async (id: string, data: Partial<Ad>) => {
  const res = await fetch(`${ADS_ENDPOINTS.UPDATE}/${id}`, {
    method: "PUT",
    headers: await auth(),
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      price: data.price,
      maGaday: data.maGaday,
    }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Error");
  return result;
};

export const deleteAd = async (id: string): Promise<boolean> => {
  try {
    return (
      await fetch(`${ADS_ENDPOINTS.DELETE}/${id}`, {
        method: "DELETE",
        headers: await auth(),
      })
    ).ok;
  } catch {
    return false;
  }
};

export const payToRelist = async (adId: string): Promise<boolean> => {
  try {
    return (
      await fetch(`${ADS_ENDPOINTS.ADS_BASE}/${adId}/pay-to-relist`, {
        method: "POST",
        headers: await auth(),
      })
    ).ok;
  } catch {
    return false;
  }
};
