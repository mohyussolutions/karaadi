"use server";

import { BUSINESS_PLAN_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers } as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

export type BusinessPlan = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  maxListings: number;
  categories: string[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getAllBusinessPlans() {
  try {
    return await fetchApi<{ success: boolean; plans: BusinessPlan[] }>(
      BUSINESS_PLAN_ENDPOINTS.GET_ALL,
    );
  } catch {
    return { success: false, plans: [] };
  }
}

export async function getBusinessPlanById(id: string) {
  try {
    return await fetchApi<{ success: boolean; plan: BusinessPlan }>(
      BUSINESS_PLAN_ENDPOINTS.BY_ID(id),
    );
  } catch {
    return { success: false };
  }
}

export async function createBusinessPlan(data: Record<string, unknown>) {
  try {
    return await fetchApi(BUSINESS_PLAN_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function updateBusinessPlan(id: string, data: Record<string, unknown>) {
  try {
    return await fetchApi(BUSINESS_PLAN_ENDPOINTS.UPDATE(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function deleteBusinessPlan(id: string) {
  try {
    return await fetchApi(BUSINESS_PLAN_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });
  } catch {
    return { success: false };
  }
}
