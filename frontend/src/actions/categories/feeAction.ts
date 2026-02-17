"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { FEE_ENDPOINTS } from "../constant/constant";
import {
  CalculatedFee,
  CalculateFeePayload,
  FeeConfig,
} from "@/app/utils/types/fee.types";

export const getActiveFee = async (): Promise<FeeConfig | null> => {
  try {
    const response = await fetch(FEE_ENDPOINTS.GET_ACTIVE, {
      next: {
        revalidate: 600,
        tags: ["fee-active"],
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const getAllFees = async (): Promise<FeeConfig[]> => {
  try {
    const response = await fetch(FEE_ENDPOINTS.GET_ALL, {
      next: {
        revalidate: 60,
        tags: ["fees-list"],
      },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const createFee = async (
  data: any,
): Promise<FeeConfig | { error: string }> => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CREATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: result.error || "Failed to create" };

    revalidateTag("fee-active");
    revalidateTag("fees-list");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const updateFee = async (
  id: string,
  data: any,
): Promise<FeeConfig | { error: string }> => {
  try {
    const response = await fetch(FEE_ENDPOINTS.UPDATE(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) return { error: "Update failed" };

    revalidateTag("fee-active");
    revalidateTag("fees-list");
    revalidatePath("/admin/fees");
    return result;
  } catch (error) {
    return { error: "Network error" };
  }
};

export const calculateApiFee = async (
  params: CalculateFeePayload,
): Promise<CalculatedFee | null> => {
  try {
    const response = await fetch(FEE_ENDPOINTS.CALCULATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
};
