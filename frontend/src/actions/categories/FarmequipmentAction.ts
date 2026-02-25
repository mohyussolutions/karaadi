"use server";

import { apiUrlsForCategoryTotals } from "../constant/constant";
import { cookies } from "next/headers";

export type Traktor = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  so?: string;
  type: string;
  make: string;
  traktortModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  region: string;
  city: string;
  images: string[];
  maGaday?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPaid?: boolean;
  extra?: any;
  user?: {
    username?: string;
    phone?: string;
    email?: string;
    [key: string]: any;
  };
};

type CreateTraktorData = Omit<Traktor, "_id">;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function createTraktor(data: any) {
  const headers = await getAuthHeaders();
  if (!headers.Authorization)
    return { success: false, message: "Fadlan soo gal nidaamka" };

  const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) return { success: false, message: result.message };

  return { success: true, _id: result.id || result._id };
}

export async function updateTraktor(
  id: string,
  data: Partial<CreateTraktorData>,
) {
  const headers = await getAuthHeaders();
  const patchData =
    Object.keys(data).length === 1 && data.isPaid !== undefined
      ? { isPaid: data.isPaid }
      : data;

  const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(patchData),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok) return { success: false, message: result.message };

  return { success: true, traktorId: id };
}

export async function deleteTraktor(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    method: "DELETE",
    headers: { Authorization: headers.Authorization },
    cache: "no-store",
  });

  if (!response.ok) {
    const result = await response.json();
    return { success: false, message: result.message };
  }

  return { success: true, message: "Xayeysiiskii waa la tirtiray." };
}

export async function getTraktors(): Promise<Traktor[]> {
  const response = await fetch(apiUrlsForCategoryTotals.Traktors, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const result = await response.json();
  const list = Array.isArray(result) ? result : result?.data || [];
  return list.map((item: any) => ({ ...item, _id: item._id || item.id }));
}

export async function getTraktorsAdmin(): Promise<Traktor[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(apiUrlsForCategoryTotals.TraktorsAdmin, {
    method: "GET",
    headers: { Authorization: headers.Authorization },
    cache: "no-store",
  });

  if (!response.ok) return [];
  const result = await response.json();
  const list = Array.isArray(result) ? result : result?.data || [];
  return list.map((item: any) => ({ ...item, _id: item._id || item.id }));
}

export async function getTraktorById(id: string): Promise<Traktor | null> {
  const response = await fetch(`${apiUrlsForCategoryTotals.Traktors}/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return null;

  const item: Traktor = await response.json();
  return {
    ...item,
    _id: item._id || (item as any).id,
  };
}
