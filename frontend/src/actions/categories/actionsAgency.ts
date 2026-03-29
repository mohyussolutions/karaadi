"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { AGENCY_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const addCacheBuster = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export const getAgencyStats = async () => {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(AGENCY_ENDPOINTS.STATS);

    const response = await fetch(url, {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return { success: false, total: 0, verified: 0 };
    return await response.json();
  } catch (error) {
    return { success: false, total: 0, verified: 0 };
  }
};

export const fetchAgencies = async () => {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(AGENCY_ENDPOINTS.BASE);

    const response = await fetch(url, {
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : data?.agencies || data?.data || [];
  } catch (error) {
    return [];
  }
};

export const createAgency = async (agencyData: any) => {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(AGENCY_ENDPOINTS.BASE);

    const response = await fetch(url, {
      method: "POST",
      headers: headers as HeadersInit,
      credentials: "include",
      body: JSON.stringify(agencyData),
      cache: "no-store",
    });
    const result = await response.json();
    revalidateTag("agencies");
    revalidateTag("agency-stats");
    revalidatePath("/agencies");
    return result;
  } catch (error) {
    return { success: false, error: "Creation failed" };
  }
};

export const updateAgency = async (id: string, agencyData: any) => {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(AGENCY_ENDPOINTS.BY_ID(id));

    const response = await fetch(url, {
      method: "PUT",
      headers: headers as HeadersInit,
      credentials: "include",
      body: JSON.stringify(agencyData),
      cache: "no-store",
    });
    const result = await response.json();
    revalidateTag("agencies");
    revalidatePath("/agencies");
    return result;
  } catch (error) {
    return { success: false, error: "Update failed" };
  }
};

export const deleteAgency = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const url = addCacheBuster(AGENCY_ENDPOINTS.BY_ID(id));

    const response = await fetch(url, {
      method: "DELETE",
      headers: headers as HeadersInit,
      credentials: "include",
      cache: "no-store",
    });
    const result = await response.json();
    revalidateTag("agencies");
    revalidateTag("agency-stats");
    revalidatePath("/agencies");
    return result;
  } catch (error) {
    return { success: false, error: "Delete failed" };
  }
};
