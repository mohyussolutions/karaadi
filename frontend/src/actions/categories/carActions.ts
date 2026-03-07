"use server";

import { revalidatePath } from "next/cache";
import { apiUrlsForCategoryTotals } from "../constant/constant";
import { cookies } from "next/headers";

export type Car = {
  _id: string;
  id: string;
  user: any;
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
  isPaid: boolean;
};

type CreateCarData = Omit<Car, "_id" | "user" | "id" | "isPaid">;

export async function getCars(): Promise<Car[]> {
  const response = await fetch(apiUrlsForCategoryTotals.Cars, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];

  const result = await response.json();
  const list = Array.isArray(result)
    ? result
    : result?.data || result?.items || [];

  return list.map((item: any) => ({
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
  })) as Car[];
}

export async function getCarById(id: string): Promise<Car | null> {
  const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const item: any = await response.json();
  return {
    ...item,
    _id: item._id || item.id,
    id: item.id || item._id,
  } as Car;
}

export async function createCar(data: CreateCarData, token: string) {
  const response = await fetch(apiUrlsForCategoryTotals.Cars, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) return { success: false, message: result.message };

  return {
    success: true,
    message: "Listing created.",
    carId: result.id || result._id,
  };
}

export async function updateCar(
  id: string,
  data: Partial<CreateCarData>,
  token: string,
) {
  const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) return { success: false, message: result.message };

  return {
    success: true,
    message: "Car listing updated successfully.",
    carId: id,
  };
}

export async function deleteCar(id: string, token: string) {
  const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!response.ok) return { success: false, message: "Delete failed." };

  return { success: true, message: "Car listing deleted successfully." };
}

export async function getAllCarsAdmin(accessToken?: string): Promise<Car[]> {
  try {
    const headers: HeadersInit = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const response = await fetch(apiUrlsForCategoryTotals.CarsAdmin, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    if (!response.ok) return [];
    const data = await response.json();
    const list = Array.isArray(data) ? data : data.data || [];
    return list.map((item: any) => ({
      ...item,
      id: item.id || item._id,
      _id: item._id || item.id,
    }));
  } catch (error) {
    return [];
  }
}

export async function toggleCarPayment(
  id: string,
  currentStatus: boolean,
  token?: string,
) {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isPaid: !currentStatus }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error();

    revalidatePath("/admin/cars");
    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCarAction(id: string, token?: string) {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) throw new Error();

    revalidatePath("/admin/cars");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createCarAction(data: any, token: string) {
  try {
    const response = await fetch(apiUrlsForCategoryTotals.Cars, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();
    if (!response.ok) return { success: false, message: result.message };

    revalidatePath("/admin/cars");
    return { success: true, id: result.id || result._id };
  } catch (error) {
    return { success: false };
  }
}

export async function getCarByIdAction(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return null;
    const item = await response.json();
    return { ...item, id: item.id || item._id, _id: item._id || item.id };
  } catch (error) {
    return null;
  }
}

export async function getTotalCars(): Promise<number> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("idToken")?.value ||
      cookieStore.get("accessToken")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(apiUrlsForCategoryTotals.TotalCars, {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch total cars: ${res.status}`);
      return 0;
    }

    const data = await res.json();
    return data.totalCars ?? data.count ?? data.total ?? 0;
  } catch (err) {
    console.error("Error fetching total cars:", err);
    return 0;
  }
}
