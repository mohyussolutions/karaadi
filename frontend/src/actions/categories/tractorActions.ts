"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Traktor = {
  _id: string;
  user: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategories: string;
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
  district: string;
  subDistrict: string;
  images: string[];
};

type CreateTraktorData = {
  title: string;
  description: string;
  price: number;
  category: string;
  subCategories: string;
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
  district: string;
  subDistrict: string;
  images: string[];
};

export async function getTraktors(): Promise<Traktor[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
      method: "GET",
      next: { tags: ["traktors"], revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];
    return list.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as Traktor[];
  } catch (error) {
    return [];
  }
}

export async function getTraktorById(id: string): Promise<Traktor | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "GET",
      next: { tags: [`traktor-${id}`], revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch tractor ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Traktor;
  } catch (error) {
    console.error(`Network error fetching tractor ${id}:`, error);
    return null;
  }
}

export async function createTraktor(data: CreateTraktorData, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
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
          result.message || "Failed to create tractor listing in backend.",
      };
    }

    revalidatePath("/traktor");
    return {
      success: true,
      message: "Traktor listing created successfully.",
      traktorId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function updateTraktor(
  id: string,
  data: Partial<CreateTraktorData>,
  token: string,
) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "PUT",
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
          result.message || "Failed to update tractor listing in backend.",
      };
    }

    revalidatePath(`/traktor/${id}`);
    revalidatePath("/traktor");
    return {
      success: true,
      message: "Traktor listing updated successfully.",
      traktorId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteTraktor(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message:
          result.message || "Failed to delete tractor listing in backend.",
      };
    }

    revalidatePath("/traktor");
    return { success: true, message: "Traktor listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}
