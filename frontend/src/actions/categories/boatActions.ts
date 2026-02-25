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
  feeAmount?: number;
  planId?: string;
  expiryDate?: Date | null;
};

type CreateBoatData = Omit<Boat, "_id" | "user">;

export async function getBoats(): Promise<Boat[] | null> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "GET",
      next: {
        revalidate: 30,
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
        revalidate: 60,
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

export async function createBoat(payload: any, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("boats");
    revalidatePath("/boats");
    return { success: true, boatId: result._id || result.id };
  } catch (error) {
    return { success: false, message: "Network error" };
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

export async function updateBoatPayment(
  boatId: string,
  paymentId: string,
  planId: string,
) {
  try {
    console.log(
      `[updateBoatPayment] Updating boat ${boatId} with payment ${paymentId}`,
    );

    const response = await fetch(
      `${apiUrlsForCategoryTotals.Boats}/${boatId}/payment`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          planId,
        }),
      },
    );

    const data = await response.json();
    console.log("[updateBoatPayment] Response:", data);

    if (response.ok) {
      revalidateTag(`boat-${boatId}`);
      revalidateTag("boats");
      revalidatePath(`/boats/${boatId}`);
      revalidatePath("/boats");
      return { success: true, data };
    }

    return {
      success: false,
      message: data.message || "Update failed",
      data: data,
    };
  } catch (error) {
    console.error("[updateBoatPayment] Error:", error);
    return { success: false, message: "Network error" };
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
