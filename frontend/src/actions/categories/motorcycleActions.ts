"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

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
    const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
      method: "GET",
      next: {
        revalidate: 300, // 5 minute background refresh
        tags: ["motorcycles"],
      },
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
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "GET",
        next: {
          revalidate: 600,
          tags: [`motorcycle-${id}`],
        },
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

export async function createMotorcycle(
  data: CreateMotorcycleData,
  token: string,
) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result?.message };

    // Kill the list cache so the new motorcycle shows up immediately
    revalidateTag("motorcycles");
    revalidatePath("/motorcycles");

    return {
      success: true,
      message: "Listing created successfully.",
      motorcycleId: result?.id || result?._id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function updateMotorcycle(
  id: string,
  data: Partial<CreateMotorcycleData>,
  token: string,
) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
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
    if (!response.ok) return { success: false, message: result?.message };

    // Update both the specific motorcycle and the general list
    revalidateTag(`motorcycle-${id}`);
    revalidateTag("motorcycles");
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

export async function deleteMotorcycle(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidateTag(`motorcycle-${id}`);
    revalidateTag("motorcycles");
    revalidatePath("/motorcycles");

    return { success: true, message: "Listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}
