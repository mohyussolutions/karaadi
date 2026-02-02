"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Boat = {
  name: string;
  _id: string;
  user: string;
  title: string;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
};

type CreateBoatData = {
  title: string;
  category: string;
  subCategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict?: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  listingType?: string;
};

export async function getBoats(): Promise<Boat[] | null> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "GET",
      next: { tags: ["boats"], revalidate: 60 },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch boats:",
        response.status,
        response.statusText,
      );
      return null;
    }

    const result: any[] = await response.json();
    return result.map((item) => ({
      ...item,
      _id: item._id || item.id,
    })) as Boat[];
  } catch (error) {
    console.error("Network error fetching boats:", error);
    return null;
  }
}

export async function getBoatById(id: string): Promise<Boat | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "GET",
      next: { tags: [`boat-${id}`], revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch boat ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Boat;
  } catch (error) {
    console.error(`Network error fetching boat ${id}:`, error);
    return null;
  }
}

export async function createBoat(data: CreateBoatData, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
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
        message: result.message || "Failed to create boat listing in backend.",
      };
    }

    revalidatePath("/boats");
    return {
      success: true,
      message: "Boat listing created successfully.",
      boatId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function updateBoat(
  id: string,
  data: Partial<CreateBoatData>,
  token: string,
) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
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
        message: result.message || "Failed to update boat listing in backend.",
      };
    }

    revalidatePath(`/boats/${id}`);
    revalidatePath("/boats");
    return {
      success: true,
      message: "Boat listing updated successfully.",
      boatId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteBoat(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message: result.message || "Failed to delete boat listing in backend.",
      };
    }

    revalidatePath("/boats");
    return { success: true, message: "Boat listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}
