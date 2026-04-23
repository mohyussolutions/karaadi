"use server";

import { FEE_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const fetchWithAuth = async (url: string, options?: RequestInit) => {
  const headers = await getAuthHeaders();
  const isWrite = options?.method && options.method !== "GET";
  return fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers } as HeadersInit,
    cache: "no-store",
  });
};

export const getAllFees = async () => {
  const { BASE_API_URL } = await import("../constant/BASE_API_URL");
  const res = await fetchWithAuth(`${BASE_API_URL}/api/Fee/all`);
  if (res.ok) {
    const data = await res.json();
    return {
      marketplace: data.marketplace ?? [],
      realEstate: data.realEstate ?? [],
      cars: data.cars ?? [],
      motorcycles: data.motorcycles ?? [],
      boats: data.boats ?? {},
      equipment: data.equipment ?? [],
      subPlans: data.subPlans ?? [],
      system: data.system ?? null,
      businessPlans: data.businessPlans ?? [],
    };
  }
  return { marketplace: [], realEstate: [], cars: [], motorcycles: [], boats: {}, equipment: [], subPlans: [], system: null, businessPlans: [] };
};

export const getMarketplaceFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MARKETPLACE.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const getMarketplaceFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MARKETPLACE.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createMarketplaceFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MARKETPLACE.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateMarketplaceFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MARKETPLACE.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteMarketplaceFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MARKETPLACE.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getRealEstateFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.REAL_ESTATE.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const getRealEstateFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.REAL_ESTATE.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createRealEstateFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.REAL_ESTATE.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateRealEstateFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.REAL_ESTATE.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteRealEstateFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.REAL_ESTATE.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getBoatFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BOATS.GET_ALL);
  if (!response.ok) return {};
  const res = await response.json();
  if (Array.isArray(res)) {
    return res.find((f: any) => f?.isActive !== false) || res[0] || {};
  }
  return res || {};
};

export const getBoatFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BOATS.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createBoatFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BOATS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateBoatFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BOATS.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteBoatFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BOATS.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getEquipmentFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.EQUIPMENT.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const getEquipmentFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.EQUIPMENT.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createEquipmentFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.EQUIPMENT.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateEquipmentFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.EQUIPMENT.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteEquipmentFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.EQUIPMENT.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getSystemConfig = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SYSTEM_CONFIG.GET);
  return response.ok ? await response.json() : null;
};

export const createSystemConfig = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SYSTEM_CONFIG.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const updateSystemConfig = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SYSTEM_CONFIG.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteSystemConfig = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SYSTEM_CONFIG.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

let _subPlansCache: { data: any; at: number } | null = null;
const SUB_PLANS_TTL = 60_000;

export const getSubPlans = async () => {
  if (_subPlansCache && Date.now() - _subPlansCache.at < SUB_PLANS_TTL) {
    return _subPlansCache.data;
  }
  const response = await fetchWithAuth(FEE_ENDPOINTS.SUB_PLANS.GET_ALL);
  if (response.ok) {
    const data = await response.json();
    _subPlansCache = { data, at: Date.now() };
    return data;
  }
  return [];
};

export const getSubPlanById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SUB_PLANS.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createSubPlan = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SUB_PLANS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateSubPlan = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SUB_PLANS.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteSubPlan = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.SUB_PLANS.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getBusinessPlanFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BUSINESS_PLANS.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const createBusinessPlanFees = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BUSINESS_PLANS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateBusinessPlanFees = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.BUSINESS_PLANS.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const getCarFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.CARS.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const getCarFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.CARS.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createCarFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.CARS.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateCarFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.CARS.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteCarFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.CARS.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};

export const getMotorcycleFees = async () => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MOTORCYCLES.GET_ALL);
  return response.ok ? await response.json() : [];
};

export const getMotorcycleFeeById = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MOTORCYCLES.GET_BY_ID(id));
  return response.ok ? await response.json() : null;
};

export const createMotorcycleFee = async (data: Record<string, unknown>) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MOTORCYCLES.CREATE, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return response.ok ? result : { error: result.error || "Failed" };
};

export const updateMotorcycleFee = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MOTORCYCLES.UPDATE(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response.ok ? await response.json() : { error: "Failed" };
};

export const deleteMotorcycleFee = async (id: string) => {
  const response = await fetchWithAuth(FEE_ENDPOINTS.MOTORCYCLES.DELETE(id), {
    method: "DELETE",
  });
  return response.ok ? { success: true } : { error: "Failed" };
};
