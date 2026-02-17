"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { AGENCY_ENDPOINTS } from "../constant/constant";

export const getAgencyStats = async () => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.STATS, {
      credentials: "include",
      next: {
        revalidate: 300,
        tags: ["agency-stats"],
      },
    });
    if (!response.ok) return { success: false, total: 0, verified: 0 };
    return await response.json();
  } catch (error) {
    return { success: false, total: 0, verified: 0 };
  }
};

export const fetchAgencies = async () => {
  try {
    const response = await fetch(AGENCY_ENDPOINTS.BASE, {
      credentials: "include",
      next: {
        revalidate: 60,
        tags: ["agencies"],
      },
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
    const response = await fetch(AGENCY_ENDPOINTS.BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(agencyData),
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
    const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(agencyData),
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
    const response = await fetch(AGENCY_ENDPOINTS.BY_ID(id), {
      method: "DELETE",
      credentials: "include",
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
