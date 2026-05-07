"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { apiUrlsForCategoryTotals } from "../constant/constant";
import type { Car, CreateCarData } from "@/app/utils/types/cars.types";

export async function getAllCarsAdmin(
  page = 1,
  pageSize = 20,
  token?: string,
): Promise<Car[]> {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(
      `${apiUrlsForCategoryTotals.CarsAdmin}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    if (!response.ok) return [];
    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];
    return list.map((item: any) => ({
      ...item,
      id: item.id || item._id || "",
      _id: item._id || item.id || "",
    }));
  } catch {
    return [];
  }
}

export async function getCars(page = 1, pageSize = 20): Promise<Car[]> {
  try {
    const response = await fetch(
      `${apiUrlsForCategoryTotals.Cars}?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) return [];
    const result = await response.json();
    const list = Array.isArray(result)
      ? result
      : result?.data || result?.items || [];
    return list.map((item: any) => ({
      ...item,
      id: item.id || item._id || "",
      _id: item._id || item.id || "",
    }));
  } catch {
    return [];
  }
}

export async function getCarById(id: string): Promise<Car | null> {
  try {
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const item = await response.json();
    return {
      ...item,
      id: item.id || item._id || "",
      _id: item._id || item.id || "",
    };
  } catch {
    return null;
  }
}

export async function createCar(data: CreateCarData, token?: string) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(apiUrlsForCategoryTotals.Cars, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok)
      return { success: false, message: result.message || "Error" };
    return { success: true, carId: result.id || result._id };
  } catch {
    return { success: false, message: "Error" };
  }
}

export async function updateCar(
  id: string,
  data: Partial<CreateCarData>,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "PUT",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok)
      return { success: false, message: result.message || "Error" };
    return { success: true, carId: id };
  } catch {
    return { success: false, message: "Error" };
  }
}

export async function deleteCar(id: string, token?: string) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export async function toggleCarPayment(
  id: string,
  newStatus: boolean,
  token?: string,
) {
  try {
    const headers = await getAuthHeaders(token);
    const response = await fetch(`${apiUrlsForCategoryTotals.Cars}/${id}`, {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ isPaid: newStatus }),
      cache: "no-store",
    });
    return { success: response.ok };
  } catch {
    return { success: false };
  }
}

export async function getTotalCars(token?: string): Promise<number> {
  try {
    const headers = await getAuthHeaders(token);
    const res = await fetch(apiUrlsForCategoryTotals.TotalCars, {
      method: "GET",
      headers: headers as HeadersInit,
      next: { revalidate: 60 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.totalCars || data.count || data.total || 0;
  } catch {
    return 0;
  }
}

export async function deleteCarAction(id: string, token?: string) {
  return deleteCar(id, token);
}

export async function toggleCarPaymentAction(
  id: string,
  currentStatus: boolean,
  token?: string,
) {
  return toggleCarPayment(id, currentStatus, token);
}
