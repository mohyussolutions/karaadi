"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Car = {
  _id: string;
  user: string;
  title: string;
  type: string;
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

type CreateCarData = Omit<Car, "_id" | "user">;

export async function getCars(): Promise<Car[]> {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Cars, {
      method: "GET",
      next: {
        revalidate: 300,
        tags: ["cars"],
      },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];

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
      next: {
        revalidate: 600,
        tags: [`car-${id}`],
      },
    });

    if (!response.ok) return null;

    const item: any = await response.json();
    return {
      ...item,
      _id: item._id || item.id,
    } as Car;
  } catch (error) {
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag("cars");
    revalidatePath("/cars");

    return {
      success: true,
      message: "Car listing created successfully.",
      carId: result.id || result._id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
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
    if (!response.ok) return { success: false, message: result.message };

    revalidateTag(`car-${id}`);
    revalidateTag("cars");
    revalidatePath(`/cars/${id}`);
    revalidatePath("/cars");

    return {
      success: true,
      message: "Car listing updated successfully.",
      carId: id,
    };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}

export async function deleteCar(id: string, token: string) {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return { success: false, message: "Delete failed." };

    revalidateTag(`car-${id}`);
    revalidateTag("cars");
    revalidatePath("/cars");

    return { success: true, message: "Car listing deleted successfully." };
  } catch (error) {
    return { success: false, message: "Network error." };
  }
}
