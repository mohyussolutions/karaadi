"use server";
import { BUSINESS_PLAN_ENDPOINTS } from "../constant/constant";
import { BUSINESS_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL } from "../constant/BASE_API_URL";
import { BusinessPlan } from "@/app/utils/types/business";
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const hasContentType =
    options?.headers &&
    ("Content-Type" in options.headers || "content-type" in options.headers);

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(hasContentType ? {} : { "Content-Type": "application/json" }),
      ...headers,
      ...options?.headers,
    } as HeadersInit,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

export async function createBusiness(data: Record<string, unknown>) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.CREATE, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function getMyBusinesses() {
  try {
    return await fetchApi<{ success: boolean; businesses: Business[] }>(
      BUSINESS_ENDPOINTS.MY,
    );
  } catch {
    return { success: false, businesses: [] };
  }
}

export async function getBusinessById(id: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.BY_ID(id));
  } catch {
    return { success: false };
  }
}

export async function updateBusiness(
  id: string,
  data: Record<string, unknown>,
) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.UPDATE(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function deleteBusiness(id: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.DELETE(id), { method: "DELETE" });
  } catch {
    return { success: false };
  }
}

export async function addBusinessMember(businessId: string, memberId: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.ADD_MEMBER(businessId), {
      method: "POST",
      body: JSON.stringify({ memberId }),
    });
  } catch {
    return { success: false };
  }
}

export async function selectBusinessPlan(businessId: string, planId: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.SELECT_PLAN(businessId), {
      method: "POST",
      body: JSON.stringify({ planId }),
    });
  } catch {
    return { success: false };
  }
}

export async function removeBusinessMember(
  businessId: string,
  memberId: string,
) {
  try {
    return await fetchApi(
      BUSINESS_ENDPOINTS.REMOVE_MEMBER(businessId, memberId),
      { method: "DELETE" },
    );
  } catch {
    return { success: false };
  }
}

export async function getAllBusinessesAdmin(page = 1, limit = 20) {
  try {
    return await fetchApi(
      `${BUSINESS_ENDPOINTS.ADMIN_ALL}?page=${page}&limit=${limit}`,
    );
  } catch {
    return { success: false, businesses: [] };
  }
}

export async function updateBusinessStatus(
  id: string,
  data: { status: string; isVerified?: boolean },
) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.ADMIN_UPDATE_STATUS(id), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function extendBusinessPlan(businessId: string, planId: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.EXTEND_PLAN(businessId), {
      method: "POST",
      body: JSON.stringify({ planId }),
    });
  } catch {
    return { success: false };
  }
}

export async function toggleAdminEnabled(
  businessId: string,
  isAdminEnabled: boolean,
) {
  try {
    return await fetchApi(
      BUSINESS_ENDPOINTS.ADMIN_TOGGLE_VISIBILITY(businessId),
      {
        method: "PATCH",
        body: JSON.stringify({ isAdminEnabled }),
      },
    );
  } catch {
    return { success: false };
  }
}

export async function adminAssignPlan(businessId: string, planId: string) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.ADMIN_ASSIGN_PLAN(businessId), {
      method: "PATCH",
      body: JSON.stringify({ planId }),
    });
  } catch {
    return { success: false };
  }
}

export async function adminSetPostLimit(
  businessId: string,
  maxListingsOverride: number | null,
) {
  try {
    return await fetchApi(BUSINESS_ENDPOINTS.ADMIN_SET_POST_LIMIT(businessId), {
      method: "PATCH",
      body: JSON.stringify({ maxListingsOverride }),
    });
  } catch {
    return { success: false };
  }
}

const CATEGORY_ENDPOINTS_MAP: Record<string, string> = {
  realestate: `${BASE_API_URL}/api/real-estate`,
  schools: `${BASE_API_URL}/api/marketplace`,
  motor: `${BASE_API_URL}/api/cars`,
  motorcycle: `${BASE_API_URL}/api/motorcycles`,
  marketplace: `${BASE_API_URL}/api/marketplace`,
};

export async function createBusinessPost(
  category: string,
  data: Record<string, unknown>,
) {
  try {
    const url =
      CATEGORY_ENDPOINTS_MAP[category] ?? `${BASE_API_URL}/api/marketplace`;
    return await fetchApi(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    return { success: false };
  }
}

export async function getBusinessListings(page = 1, pageSize = 20) {
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/businesses/feed?page=${page}&pageSize=${pageSize}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function getListingsByBusinessOwner(userId: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BASE_API_URL}/api/businesses/feed?userId=${userId}&pageSize=100`,
      { headers: headers as HeadersInit, cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function getBusinessStats() {
  try {
    return await fetchApi<{
      success: boolean;
      stats: {
        total: number;
        active: number;
        pending: number;
        verified: number;
      };
    }>(BUSINESS_ENDPOINTS.STATS);
  } catch {
    return {
      success: false,
      stats: { total: 0, active: 0, pending: 0, verified: 0 },
    };
  }
}

export type Business = {
  id: string;
  userId: string;
  name: string;
  orgNumber?: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  logo?: string;
  images?: string[];
  description?: string;
  categories: string[];
  contactName?: string;
  planType?: string;
  planId?: string;
  planStartDate?: string;
  status: string;
  isVerified: boolean;
  isPaid: boolean;
  isAdminEnabled: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  currentListings?: number;
  maxListingsOverride?: number | null;
  plan?: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    features: string[];
    maxListings: number;
  };
  owner?: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  members?: { id: string; username: string; email: string }[];
};

async function fetchPlan<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers } as HeadersInit,
    ...(options?.method ? {} : { next: { revalidate: 300 } }),
  });
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

export async function getAllBusinessPlans() {
  try {
    return await fetchPlan<{ success: boolean; plans: BusinessPlan[] }>(
      BUSINESS_PLAN_ENDPOINTS.GET_ALL,
    );
  } catch {
    return { success: false, plans: [] };
  }
}

export async function getBusinessPlanById(id: string) {
  try {
    return await fetchPlan<{ success: boolean; plan: BusinessPlan }>(
      BUSINESS_PLAN_ENDPOINTS.BY_ID(id),
    );
  } catch {
    return { success: false };
  }
}

export async function createBusinessPlan(data: Record<string, unknown>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(BUSINESS_PLAN_ENDPOINTS.CREATE, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { success: false };
  }
}

export async function updateBusinessPlan(
  id: string,
  data: Record<string, unknown>,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(BUSINESS_PLAN_ENDPOINTS.UPDATE(id), {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
    });
    return res.json();
  } catch {
    return { success: false };
  }
}

export async function deleteBusinessPlan(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(BUSINESS_PLAN_ENDPOINTS.DELETE(id), {
      method: "DELETE",
      headers: headers as HeadersInit,
    });
    return res.json();
  } catch {
    return { success: false };
  }
}
