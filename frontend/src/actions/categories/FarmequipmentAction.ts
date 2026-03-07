"use server";

import { apiUrlsForCategoryTotals } from "../constant/constant";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type FarmEquipment = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  so?: string;
  type: string;
  make: string;
  traktortModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  region: string;
  city: string;
  images: string[];
  maGaday?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPaid?: boolean;
  extra?: Record<string, unknown>;
  user?: {
    username?: string;
    phone?: string;
    email?: string;
    [key: string]: unknown;
  };
};

type ApiResponse<T> = {
  data?: T;
  items?: T[];
  total?: number;
  count?: number;
  totalFarmEquipment?: number;
  message?: string;
};

type HeadersWithAuth = {
  "Content-Type": string;
  "Cache-Control": string;
  Pragma: string;
  Expires: string;
  Authorization?: string;
};

async function getAuthHeaders(token?: string): Promise<HeadersWithAuth> {
  const cookieStore = await cookies();

  const cookieToken =
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  const authToken = token || cookieToken;

  const headers: HeadersWithAuth = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
    console.log("✅ Auth token found and added to headers");
  } else {
    console.warn("❌ No auth token found in cookies");
  }

  return headers;
}

export async function getAllFarmEquipment(): Promise<FarmEquipment[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(apiUrlsForCategoryTotals.TraktorsAdmin, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return [];

    const result: ApiResponse<FarmEquipment[]> = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

    return list.map((item) => ({
      ...item,
      _id: item._id || item.id,
    }));
  } catch (error) {
    console.error("Error fetching all farm equipment:", error);
    return [];
  }
}

export async function getFarmequipment(): Promise<FarmEquipment[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return [];

    const result: ApiResponse<FarmEquipment[]> = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

    return list.map((item) => ({
      ...item,
      _id: item._id || item.id,
    }));
  } catch (error) {
    console.error("Error fetching farm equipment:", error);
    return [];
  }
}

export async function getFarmEquipmentById(
  id: string,
): Promise<FarmEquipment | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const item = (await response.json()) as FarmEquipment;
    return {
      ...item,
      _id: item._id || (item as any).id,
    };
  } catch (error) {
    console.error("Error fetching farm equipment by id:", error);
    return null;
  }
}

export async function createTraktor(
  data: Partial<FarmEquipment>,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);

    if (!headers.Authorization) {
      return { success: false, message: "Fadlan soo gal nidaamka" };
    }

    const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = (await response.json()) as {
      id?: string;
      _id?: string;
      message?: string;
    };

    if (!response.ok)
      return { success: false, message: result.message || "Failed to create" };

    revalidatePath("/farm-equipment");
    revalidatePath("/admin/farm-equipment");
    return { success: true, _id: result.id || result._id || "" };
  } catch (error) {
    console.error("Error creating traktor:", error);
    return { success: false, message: "Cilad ayaa dhacday" };
  }
}

export async function updateTraktor(
  id: string,
  data: Partial<FarmEquipment>,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);

    if (!headers.Authorization) {
      return { success: false, message: "Fadlan soo gal nidaamka" };
    }

    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok)
      return { success: false, message: result.message || "Failed to update" };

    revalidatePath(`/farm-equipment/${id}`);
    revalidatePath("/farm-equipment");
    revalidatePath("/admin/farm-equipment");
    return { success: true, traktorId: id };
  } catch (error) {
    console.error("Error updating traktor:", error);
    return { success: false, message: "Cilad ayaa dhacday" };
  }
}

export async function deleteTraktor(id: string, token?: string) {
  try {
    const headers = await getAuthHeaders(token);

    if (!headers.Authorization) {
      return { success: false, message: "Fadlan soo gal nidaamka" };
    }

    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return { success: false };

    revalidatePath("/farm-equipment");
    revalidatePath("/admin/farm-equipment");
    return { success: true, message: "Xayeysiiskii waa la tirtiray." };
  } catch (error) {
    console.error("Error deleting traktor:", error);
    return { success: false };
  }
}

export async function getFarmEquipmentTotal(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("idToken")?.value ||
      cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(apiUrlsForCategoryTotals.TotalFarmEquipment, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch total farm equipment: ${res.status}`);
      return 0;
    }

    const data = await res.json();
    console.log(data);
    return (
      data.totalTractors ??
      data.totalFarmEquipment ??
      data.count ??
      data.total ??
      0
    );
  } catch (err) {
    console.error("Error fetching total farm equipment:", err);
    return 0;
  }
}
export async function toggleFarmEquipmentPaymentAction(
  id: string,
  currentStatus: boolean,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);

    if (!headers.Authorization) {
      return { success: false, message: "Fadlan soo gal nidaamka" };
    }

    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    });

    if (!response.ok) return { success: false };

    revalidatePath("/admin/farm-equipment");
    return { success: true };
  } catch (error) {
    console.error("Error toggling payment status:", error);
    return { success: false };
  }
}
