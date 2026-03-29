"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export type Motorcycle = {
  _id: string;
  user: string;
  title: string;
  category: string;
  transmission?: string;
  price: number;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  subCategory: string;
  subCategories: string[];
  images: string[];
  type: string;
  make: string;
  modelName: string;
  year: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  color: string;
  description: string;
};

type CreateMotorcycleData = Omit<Motorcycle, "_id" | "user">;

export async function getMotorcycles(): Promise<Motorcycle[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) return [];

    const result = await response.json();
    const list = Array.isArray(result) ? result : result?.data || [];

    return list.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as Motorcycle[];
  } catch (error) {
    return [];
  }
}

export async function getMotorcycleById(
  id: string,
): Promise<Motorcycle | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "GET",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const item = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Motorcycle;
  } catch (error) {
    return null;
  }
}

export async function createMotorcycle(data: any, token?: string) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result?.message };

    revalidatePath("/motorcycles");
    return { success: true, motorcycleId: result.id || result._id };
  } catch (error) {
    return { success: false, message: "Network error" };
  }
}

export async function updateMotorcycle(
  id: string,
  data: Partial<CreateMotorcycleData>,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "PUT",
        headers: headers as HeadersInit,
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    const result = await response.json();
    if (!response.ok) return { success: false, message: result?.message };

    revalidatePath(`/motorcycles/${id}`);
    revalidatePath("/motorcycles");

    return {
      success: true,
      message: "Listing updated successfully.",
      motorcycleId: id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function deleteMotorcycle(id: string, token?: string) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "DELETE",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidatePath("/motorcycles");
    return { success: true, message: "Listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function getTotalMotorcyclesAction(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.TotalMotorcycles, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!res.ok) {
      return 0;
    }

    const data = await res.json();
    return data.totalMotorcycles ?? data.count ?? data.total ?? 0;
  } catch (error) {
    return 0;
  }
}

export async function getAllMotorcyclesAdminAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.MotorcyclesAdmin, {
      method: "GET",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    return [];
  }
}

export async function toggleMotorcyclePaidAction(
  id: string,
  currentStatus: boolean,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    });

    if (!res.ok) return { success: false };
    revalidatePath("/admin/motorcycles");
    return { success: true };
  } catch (error) {
    console.error("Error toggling motorcycle payment:", error);
    return { success: false };
  }
}

export async function deleteMotorcycleAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrlsForCategoryTotals.Motorcycles}/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!res.ok) return { success: false };
    revalidatePath("/admin/motorcycles");
    return { success: true };
  } catch (error) {
    console.error("Error deleting motorcycle:", error);
    return { success: false };
  }
}
