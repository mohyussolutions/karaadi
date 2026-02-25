"use server";

import { REAL_ESTATE_ENDPOINTS } from "../constant/constant";

export type RealEstate = {
  id: string;
  _id: string;
  user: any;
  title: string;
  description: string;
  price: number;
  subCategory: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  address: string;
  region: string;
  city: string;
  images: string[];
  isPaid: boolean;
};

export async function getRealEstateById(
  id: string,
): Promise<RealEstate | null> {
  const response = await fetch(REAL_ESTATE_ENDPOINTS.BY_ID(id), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;
  const result = await response.json();
  return result || null;
}

export async function getRealEstateListings(): Promise<RealEstate[]> {
  const response = await fetch(REAL_ESTATE_ENDPOINTS.BASE, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const result = await response.json();
  const data = Array.isArray(result) ? result : (result?.data ?? []);

  return data.map((item: any) => ({
    ...item,
    _id: item._id || item.id,
  }));
}

export async function fetchAdminRealEstate() {
  const res = await fetch(REAL_ESTATE_ENDPOINTS.ADMIN_ALL, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

export async function updatePaidStatus(id: string, newStatus: boolean) {
  const res = await fetch(REAL_ESTATE_ENDPOINTS.BY_ID(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPaid: newStatus }),
    cache: "no-store",
  });

  return { success: res.ok };
}

export async function deleteRealEstate(id: string) {
  const response = await fetch(REAL_ESTATE_ENDPOINTS.BY_ID(id), {
    method: "DELETE",
    cache: "no-store",
  });

  return { success: response.ok };
}

export async function createRealEstate(data: any, token: string) {
  const response = await fetch(REAL_ESTATE_ENDPOINTS.BASE, {
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

  return { success: true, id: result.id || result._id };
}
