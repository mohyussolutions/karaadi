"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";
import { cookies } from "next/headers";

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

async function getAuthHeaders(token?: string) {
  const cookieStore = await cookies();
  const cookieToken =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;
  const authToken = token || cookieToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
}

export async function getBoats(): Promise<Boat[] | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "GET",
      headers,
      cache: "no-store",
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "GET",
      headers,
      cache: "no-store",
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
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCategoryTotals.Boats, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
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
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
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
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Boats}/${boatId}/payment`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ paymentId, planId }),
        cache: "no-store",
      },
    );

    const data = await response.json();

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
    return { success: false, message: "Network error" };
  }
}

export async function deleteBoat(id: string, token: string) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
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

export async function getTotalBoatsAction(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.TotalBoats, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch total boats: ${res.status}`);
      return 0;
    }

    const data = await res.json();
    return data.totalBoats ?? data.count ?? data.total ?? 0;
  } catch (error) {
    console.error("Error fetching total boats:", error);
    return 0;
  }
}

export async function getAllBoatsAdminAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(apiUrlsForCategoryTotals.BoatsAdmin, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching admin boats:", error);
    return [];
  }
}

export async function toggleBoatPaymentAction(
  id: string,
  currentStatus: boolean,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    });

    if (!res.ok) return { success: false };
    const updated = await res.json();
    revalidatePath("/admin/boats");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling boat payment:", error);
    return { success: false };
  }
}

export async function deleteBoatAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${apiUrlsForCategoryTotals.Boats}/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return { success: false };
    revalidatePath("/admin/boats");
    return { success: true };
  } catch (error) {
    console.error("Error deleting boat:", error);
    return { success: false };
  }
}
