"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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

type CreateTraktorData = Omit<Traktor, "_id" | "user">;

export async function getTraktors(): Promise<Traktor[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["traktors"],
      },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const list: Traktor[] = Array.isArray(result) ? result : result?.data || [];

    return list.map((item: Traktor) => ({
      ...item,
      _id: item._id || (item as any).id,
    }));
  } catch {
    return [];
  }
}

export async function getTraktorById(id: string): Promise<Traktor | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "GET",
      next: {
        revalidate: 600,
        tags: [`traktor-${id}`],
      },
    });

    if (!response.ok) return null;

    const item: Traktor = await response.json();
    return {
      ...item,
      _id: item._id || (item as any).id,
    };
  } catch {
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("traktors");
    revalidatePath("/traktor");

    return {
      success: true,
      message: "Listing created successfully.",
      traktorId: result.id || result._id,
    };
  } catch {
    return { success: false, message: "Network error." };
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`traktor-${id}`);
    revalidateTag("traktors");
    revalidatePath(`/traktor/${id}`);
    revalidatePath("/traktor");

    return {
      success: true,
      message: "Listing updated successfully.",
      traktorId: id,
    };
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function deleteTraktor(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return { success: false };

    revalidateTag(`traktor-${id}`);
    revalidateTag("traktors");
    revalidatePath("/traktor");

    return { success: true, message: "Listing deleted." };
  } catch {
    return { success: false, message: "Network error." };
  }
}
