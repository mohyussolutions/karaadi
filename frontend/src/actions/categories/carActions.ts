"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Car = {
  _id: string;
  user: string;
  title: string;
  mainCategory: string;
  category: string;
  subcategory: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  description: string;
  price: number;
  images: string[];
  listingType: string;
  brand: string;
  vehicleModel: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
};

type CreateCarData = {
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string;
  subcategory: string;
  listingType: string;
  brand: string;
  vehicleModel: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
};

export async function getCars(): Promise<Car[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Cars, {
      method: "GET",
      next: { tags: ["cars"], revalidate: 60 },
    });

    if (!response.ok) {
      console.error(
        "Failed to fetch cars:",
        response.status,
        response.statusText,
      );
      return [];
    }

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.items)
          ? result.items
          : [];

    if (!Array.isArray(list)) {
      console.error("Cars API returned non-array data structure:", result);
      return [];
    }

    return list.map((item: any) => ({
      ...item,
      _id: item._id || item.id,
    })) as Car[];
  } catch (error) {
    return [];
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "GET",
      next: { tags: [`car-${id}`], revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch car ${id}:`,
        response.status,
        response.statusText,
      );
      return null;
    }

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Car;
  } catch (error) {
    console.error(`Network error fetching car ${id}:`, error);
    return null;
  }
}

export async function createCar(data: CreateCarData, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Cars, {
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
        message: result.message || "Failed to create car listing in backend.",
      };
    }

    revalidatePath("/cars");
    return {
      success: true,
      message: "Car listing created successfully.",
      carId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function updateCar(
  id: string,
  data: Partial<CreateCarData>,
  token: string,
) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
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
        message: result.message || "Failed to update car listing in backend.",
      };
    }

    revalidatePath(`/cars/${id}`);
    revalidatePath("/cars");
    return {
      success: true,
      message: "Car listing updated successfully.",
      carId: result.id,
    };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}

export async function deleteCar(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message: result.message || "Failed to delete car listing in backend.",
      };
    }

    revalidatePath("/cars");
    return { success: true, message: "Car listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error or unable to reach API." };
  }
}
