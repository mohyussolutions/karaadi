import { BASE_API_URL } from "../constant/BASE_API_URL";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BUSINESS_ENDPOINTS, BUSINESS_PLAN_ENDPOINTS } from "../constant/constant";
import type { Business } from "./businessActions";

const LISTING_DELETE_URLS: Record<string, string> = {
  Cars: `${BASE_API_URL}/api/cars`,
  "Real Estate": `${BASE_API_URL}/api/real-estate`,
  Marketplace: `${BASE_API_URL}/api/marketplace`,
  Schools: `${BASE_API_URL}/api/marketplace`,
  Boats: `${BASE_API_URL}/api/boats`,
  Motorcycles: `${BASE_API_URL}/api/motorcycles`,
  "Farm Equipment": `${BASE_API_URL}/api/traktor`,
};

async function apiFetch(url: string, options?: RequestInit) {
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, "Content-Type": "application/json", ...options?.headers } as HeadersInit,
    cache: "no-store",
  });
  return res;
}

export async function adminGetAllBusinesses(): Promise<{ businesses: Business[]; plans: any[] }> {
  const [bizRes, planRes] = await Promise.all([
    apiFetch(`${BUSINESS_ENDPOINTS.ADMIN_ALL}?page=1&limit=50`),
    apiFetch(BUSINESS_PLAN_ENDPOINTS.GET_ALL),
  ]);
  const bizData = bizRes.ok ? await bizRes.json() : {};
  const planData = planRes.ok ? await planRes.json() : {};
  return {
    businesses: (bizData?.businesses ?? []) as Business[],
    plans: ((planData?.plans ?? []) as any[]).filter((p) => p.isActive),
  };
}

export async function adminUpdateBusinessStatus(id: string, status: string, isVerified: boolean) {
  const res = await apiFetch(BUSINESS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
    method: "PUT",
    body: JSON.stringify({ status, isVerified }),
  });
  return res.ok ? res.json() : null;
}

export async function adminDeleteBusiness(id: string) {
  const res = await apiFetch(BUSINESS_ENDPOINTS.DELETE(id), { method: "DELETE" });
  return res.ok;
}

export async function adminAssignPlanDirect(businessId: string, planId: string) {
  const res = await apiFetch(BUSINESS_ENDPOINTS.ADMIN_ASSIGN_PLAN(businessId), {
    method: "POST",
    body: JSON.stringify({ planId }),
  });
  return res.ok ? res.json() : null;
}

export async function adminSetPostLimitDirect(businessId: string, limit: number | null) {
  const res = await apiFetch(BUSINESS_ENDPOINTS.ADMIN_SET_POST_LIMIT(businessId), {
    method: "POST",
    body: JSON.stringify({ maxListingsOverride: limit }),
  });
  return res.ok ? res.json() : null;
}

export async function adminGetListingsByBusiness(businessId: string): Promise<any[]> {
  const res = await apiFetch(`${BASE_API_URL}/api/businesses/feed?businessId=${businessId}&pageSize=200`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export async function adminDeleteListing(id: string, mainCategory: string): Promise<boolean> {
  const base = LISTING_DELETE_URLS[mainCategory] ?? `${BASE_API_URL}/api/marketplace`;
  const res = await apiFetch(`${base}/${id}`, { method: "DELETE" });
  return res.ok;
}
