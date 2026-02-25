"use server";

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
