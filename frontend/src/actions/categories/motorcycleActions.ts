"use server";

import { revalidatePath } from "next/cache";
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

type CreateMotorcycleData = {
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

export async function getMotorcycles(): Promise<Motorcycle[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
      method: "GET",
      next: { tags: ["motorcycles"], revalidate: 60 },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch motorcycles:",
        response.status,
        response.statusText,
      );
      return [];
    }

    const result = await response.json();

    const motorcycleList = Array.isArray(result)
      ? result
      : result && result.data && Array.isArray(result.data)
        ? result.data
        : [];

    if (!Array.isArray(motorcycleList)) {
      console.error(
        "Motorcycles API returned non-array data structure:",
        result,
      );
      return [];
    }

    return motorcycleList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as Motorcycle[];
  } catch (error) {
    console.error("Network error fetching motorcycles:", error);
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
        next: { tags: [`motorcycle-${id}`], revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch motorcycle ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item = await response.json();

    if (!item || typeof item !== "object") {
      console.error(`Motorcycle API returned invalid data for ID ${id}:`, item);
      return null;
    }

    return {
      ...item,
      _id: item._id || item.id,
    } as Motorcycle;
  } catch (error) {
    console.error(`Network error fetching motorcycle ${id}:`, error);
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

    if (!response.ok) {
      return {
        success: false,
        message:
          result?.message || "Failed to create motorcycle listing in backend.",
      };
    }

    revalidatePath("/motorcycles");

    return {
      success: true,
      message: "Motorcycle listing created successfully.",
      motorcycleId: result?.id,
    };
  } catch (error) {
    console.error("Network error creating motorcycle:", error);
    return { success: false, message: "Network error or unable to reach API." };
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

    if (!response.ok) {
      return {
        success: false,
        message:
          result?.message || "Failed to update motorcycle listing in backend.",
      };
    }

    revalidatePath(`/motorcycles/${id}`);
    revalidatePath("/motorcycles");

    return {
      success: true,
      message: "Motorcycle listing updated successfully.",
      motorcycleId: result?.id,
    };
  } catch (error) {
    console.error("Network error updating motorcycle:", error);
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteMotorcycle(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message:
          result?.message || "Failed to delete motorcycle listing in backend.",
      };
    }

    revalidatePath("/motorcycles");

    return {
      success: true,
      message: "Motorcycle listing deleted successfully.",
    };
  } catch (error) {
    console.error("Network error deleting motorcycle:", error);
    return { success: false, message: "Network error or unable to reach API." };
  }
}
