"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Boat = {
  _id: string;
  user: string;
  title: string;
  so: string;
  mainCategory: "Boats";
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict: string | null;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  maGaday: boolean;
  isPaid: boolean;
};

type CreateBoatData = Omit<Boat, "_id" | "user">;

export async function getBoats(): Promise<Boat[] | null> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["boats"],
      },
    });

    if (!response.ok) return null;
    const result: any[] = await response.json();

    return result.map((item) => ({
      ...item,
      _id: item._id || item.id,
    })) as Boat[];
  } catch (error) {
    return null;
  }
}

export async function getBoatById(id: string): Promise<Boat | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "GET",
      next: {
        revalidate: 600,
        tags: [`boat-${id}`],
      },
    });

    if (!response.ok) return null;
    const item: any = await response.json();

    return {
      ...item,
      _id: item._id || item.id,
    } as Boat;
  } catch (error) {
    return null;
  }
}

export async function createBoatAction(data: CreateBoatData, token: string) {
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("boats");
    revalidatePath("/boats");

    return {
      success: true,
      message: "Boat listing created successfully.",
      _id: result._id || result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`boat-${id}`);
    revalidateTag("boats");
    revalidatePath(`/boats/${id}`);
    revalidatePath("/boats");

    return { success: true, message: "Updated successfully.", boatId: id };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function deleteBoat(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidateTag(`boat-${id}`);
    revalidateTag("boats");
    revalidatePath("/boats");

    return { success: true, message: "Deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}
