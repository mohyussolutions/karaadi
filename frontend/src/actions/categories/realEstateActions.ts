"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type RealEstate = {
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

type CreateRealEstateData = {
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

export async function getRealEstateListings(): Promise<RealEstate[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.RealEstate, {
      method: "GET",
      next: { tags: ["real-estate-listings"], revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    const listingList = Array.isArray(result)
      ? result
      : result && result.data && Array.isArray(result.data)
        ? result.data
        : [];

    if (!Array.isArray(listingList)) {
      return [];
    }

    return listingList.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as RealEstate[];
  } catch (error) {
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
        next: { tags: [`real-estate-${id}`], revalidate: 3600 },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch real estate listing ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as RealEstate;
  } catch (error) {
    console.error(`Network error fetching real estate listing ${id}:`, error);
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

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message || "Failed to create real estate listing in backend.",
      };
    }

    revalidatePath("/real-estate");
    return {
      success: true,
      message: "Real Estate listing created successfully.",
      realEstateId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
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

    if (!response.ok) {
      return {
        success: false,
        message:
          result.message || "Failed to update real estate listing in backend.",
      };
    }

    revalidatePath(`/real-estate/${id}`);
    revalidatePath("/real-estate");
    return {
      success: true,
      message: "Real Estate listing updated successfully.",
      realEstateId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteRealEstate(id: string, token: string) {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.RealEstate}/${id}`,
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
          result.message || "Failed to delete real estate listing in backend.",
      };
    }

    revalidatePath("/real-estate");
    return {
      success: true,
      message: "Real Estate listing deleted successfully.",
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function toggleRealEstatePaidStatus(
  propertyId: string,
  newStatus: boolean,
): Promise<boolean> {
  try {
    const res = await fetch(
      `http://localhost:8080/api/real-estate/${propertyId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: newStatus }),
        credentials: "include",
      },
    );
    return res.ok;
  } catch (err) {
    console.error("Toggle paid error:", err);
    return false;
  }
}
