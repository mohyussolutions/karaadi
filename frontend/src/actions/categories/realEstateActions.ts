"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type RealEstate = {
  id: string;
  _id: string;
  user: string;
  title: string;
  description: string;
  price: number;
  subCategory: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  address: string;
  hasGarage?: boolean;
  hasGarden?: boolean;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
};

type CreateRealEstateData = Omit<RealEstate, "_id" | "user">;

export async function getRealEstateListings(): Promise<RealEstate[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.RealEstate, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["real-estate-listings"],
      },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const listingList = Array.isArray(result) ? result : (result?.data ?? []);

    return listingList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as RealEstate[];
  } catch {
    return [];
  }
}

export async function getRealEstateById(
  id: string,
): Promise<RealEstate | null> {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.RealEstate}/${id}`,
      {
        method: "GET",
        next: {
          revalidate: 600,
          tags: [`real-estate-${id}`],
        },
      },
    );

    if (!response.ok) return null;

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as RealEstate;
  } catch {
    return null;
  }
}

export async function createRealEstate(
  data: CreateRealEstateData,
  token: string,
) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.RealEstate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("real-estate-listings");
    revalidatePath("/real-estate");

    return {
      success: true,
      message: "Real Estate listing created successfully.",
      realEstateId: result.id || result._id,
    };
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function updateRealEstate(
  id: string,
  data: Partial<CreateRealEstateData>,
  token: string,
) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.RealEstate}/${id}`,
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`real-estate-${id}`);
    revalidateTag("real-estate-listings");
    revalidatePath(`/real-estate/${id}`);
    revalidatePath("/real-estate");

    return {
      success: true,
      message: "Real Estate listing updated successfully.",
      realEstateId: id,
    };
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function deleteRealEstate(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.RealEstate}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) return { success: false };

    revalidateTag(`real-estate-${id}`);
    revalidateTag("real-estate-listings");
    revalidatePath("/real-estate");

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function toggleRealEstatePaidStatus(
  propertyId: string,
  newStatus: boolean,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${apiUrlsForCategoryTotals.RealEstate}/${propertyId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: newStatus }),
      },
    );

    if (res.ok) {
      revalidateTag(`real-estate-${propertyId}`);
      revalidateTag("real-estate-listings");
    }

    return res.ok;
  } catch {
    return false;
  }
}
