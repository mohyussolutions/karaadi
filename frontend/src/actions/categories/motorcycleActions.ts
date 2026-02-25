"use server";

import { apiUrlsForCategoryTotals } from "../constant/constant";

export type Motorcycle = {
  _id: string;
  user: string;
  title: string;
  category: string;
  transmission?: string;
  price: number;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  subCategory: string;
  subCategories: string[];
  images: string[];
  type: string;
  make: string;
  modelName: string;
  year: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  color: string;
  description: string;
};

type CreateMotorcycleData = Omit<Motorcycle, "_id" | "user">;

export async function getMotorcycles(): Promise<Motorcycle[]> {
  const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];

  const result = await response.json();
  const list = Array.isArray(result) ? result : result?.data || [];

  return list.map((item: any) => ({
    ...item,
    _id: item._id || item.id,
  })) as Motorcycle[];
}

export async function getMotorcycleById(
  id: string,
): Promise<Motorcycle | null> {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const item = await response.json();
  return {
    ...item,
    _id: item._id || item.id,
  } as Motorcycle;
}

export async function createMotorcycle(data: any, token: string) {
  const response = await fetch(apiUrlsForCategoryTotals.Motorcycles, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) return { success: false, message: result?.message };

  return { success: true, motorcycleId: result.id || result._id };
}

export async function updateMotorcycle(
  id: string,
  data: Partial<CreateMotorcycleData>,
  token: string,
) {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  const result = await response.json();
  if (!response.ok) return { success: false, message: result?.message };

  return {
    success: true,
    message: "Listing updated successfully.",
    motorcycleId: id,
  };
}

export async function deleteMotorcycle(id: string, token: string) {
  const response = await fetch(
    `${apiUrlsForCategoryTotals.Motorcycles}/${id}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!response.ok) return { success: false, message: "Delete failed." };

  return { success: true, message: "Listing deleted successfully." };
}
