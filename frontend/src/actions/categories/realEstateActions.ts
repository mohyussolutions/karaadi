"use server";

import { revalidatePath } from "next/cache";
import { REAL_ESTATE_ENDPOINTS } from "../constant/constant";
import { cookies } from "next/headers";

export type RealEstate = {
  id: string;
  _id: string;
  user: any;
  title: string;
  description: string;
  price: number;
  subCategory: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  address: string;
  region: string;
  city: string;
  images: string[];
  isPaid: boolean;
  maGadayn?: boolean;
};

async function getAuthHeaders(token?: string) {
  const cookieStore = await cookies();
  const cookieToken =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;
  const authToken = token || cookieToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export async function getTotalRealEstateCount(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.TOTAL);

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return 0;
    const result = await response.json();
    return result.totalRealEstates ?? result.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRealEstateById(
  id: string,
): Promise<RealEstate | null> {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.BY_ID(id));

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result || null;
  } catch {
    return null;
  }
}

export async function getRealEstateListings(): Promise<RealEstate[]> {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.BASE);

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return [];
    const result = await response.json();
    const data = Array.isArray(result) ? result : (result?.data ?? []);

    return data.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
      id: item.id || item._id,
    }));
  } catch {
    return [];
  }
}

export async function fetchAdminRealEstate() {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.ADMIN_ALL);

    const res = await fetch(url, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function updatePaidStatus(id: string, newStatus: boolean) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.BY_ID(id));

    const res = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isPaid: newStatus }),
      cache: "no-store",
    });

    if (res.ok) {
      revalidatePath("/admin/real-estate");
    }

    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function deleteRealEstate(id: string) {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.BY_ID(id));

    const response = await fetch(url, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (response.ok) {
      revalidatePath("/admin/real-estate");
    }

    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export async function createRealEstate(data: any, token: string) {
  try {
    const headers = await getAuthHeaders(token);
    const url = addCacheBuster(REAL_ESTATE_ENDPOINTS.BASE);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result.message };

    revalidatePath("/real-estate");
    return { success: true, id: result.id || result._id };
  } catch {
    return { success: false, message: "Network error" };
  }
}
