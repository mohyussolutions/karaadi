"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { FEE_ENDPOINTS } from "../constant/constant";

export const getMarketplaceFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MARKETPLACE.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-marketplace"] },
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getMarketplaceFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MARKETPLACE.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createMarketplaceFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MARKETPLACE.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-marketplace");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateMarketplaceFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MARKETPLACE.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-marketplace");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteMarketplaceFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MARKETPLACE.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-marketplace");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

export const getRealEstateFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.REAL_ESTATE.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-realestate"] },
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getRealEstateFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.REAL_ESTATE.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createRealEstateFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.REAL_ESTATE.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-realestate");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateRealEstateFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.REAL_ESTATE.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-realestate");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteRealEstateFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.REAL_ESTATE.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-realestate");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

const normalizeBoatFee = (res: any) => {
  if (!res) return {};
  if (Array.isArray(res)) {
    if (res.length === 0) return {};
    const active = res.find((f) => f.isActive !== false);
    return active || res[0] || {};
  }
  return res;
};

export const getBoatFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.BOATS.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-boats"] },
    });
    const res = response.ok ? await response.json() : null;
    return normalizeBoatFee(res);
  } catch (error) {
    return {};
  }
};

export const getBoatFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.BOATS.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createBoatFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.BOATS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-boats");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateBoatFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.BOATS.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-boats");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteBoatFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.BOATS.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-boats");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

export const getEquipmentFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.EQUIPMENT.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-equipment"] },
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getEquipmentFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.EQUIPMENT.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createEquipmentFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.EQUIPMENT.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-equipment");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateEquipmentFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.EQUIPMENT.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-equipment");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteEquipmentFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.EQUIPMENT.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-equipment");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

export const getSystemConfig = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SYSTEM_CONFIG.GET, {
      next: { revalidate: 600, tags: ["system-config"] },
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createSystemConfig = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SYSTEM_CONFIG.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("system-config");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateSystemConfig = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SYSTEM_CONFIG.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("system-config");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteSystemConfig = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SYSTEM_CONFIG.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("system-config");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

export const getSubPlans = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SUB_PLANS.GET_ALL, {
      next: { revalidate: 60, tags: ["sub-plans"] },
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getSubPlanById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SUB_PLANS.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createSubPlan = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SUB_PLANS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("sub-plans");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateSubPlan = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SUB_PLANS.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("sub-plans");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteSubPlan = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.SUB_PLANS.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("sub-plans");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

export const getCarFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CARS.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-cars"] },
    });

    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getCarFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CARS.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createCarFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CARS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-cars");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateCarFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CARS.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-cars");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteCarFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CARS.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-cars");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};

/* --- MOTORCYCLES --- */

export const getMotorcycleFees = async () => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MOTORCYCLES.GET_ALL, {
      next: { revalidate: 60, tags: ["fees-motorcycles"] },
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    return [];
  }
};

export const getMotorcycleFeeById = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MOTORCYCLES.GET_BY_ID(id));
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
};

export const createMotorcycleFee = async (data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MOTORCYCLES.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };
    revalidateTag("fees-motorcycles");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateMotorcycleFee = async (id: string, data: any) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MOTORCYCLES.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };
    revalidateTag("fees-motorcycles");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const deleteMotorcycleFee = async (id: string) => {
  try {
    const response = await fetch(FEE_ENDPOINTS.MOTORCYCLES.DELETE(id), {
      method: "DELETE",
    });
    if (!response.ok) return { error: "Delete failed" };
    revalidateTag("fees-motorcycles");
    revalidatePath("/admin/fees");
    return { success: true };
  } catch (error) {
    return { error: "Network error" };
  }
};
