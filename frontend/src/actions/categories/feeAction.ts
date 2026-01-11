import { FEE_ENDPOINTS } from "../constant/constant";

export interface LISTING_TYPES_Props {
  FEE: number;
  FREE: number;
}

export const LISTING_TYPES: LISTING_TYPES_Props = {
  FEE: 1,
  FREE: 0,
};

export interface AppCategories {
  marketplace: string;
  car: string;
  realestate: string;
  boat: string;
  motorcycle: string;
  traktor: string;
  advertisement: string;
  subscription: string;
}

export interface FeeConfig {
  id?: string;
  art?: string;
  electronics?: string;
  animal?: string;
  sports?: string;
  furniture?: string;
  fashion?: string;
  rent?: string;
  sale?: string;
  land?: string;
  farm?: string;
  business?: string;
  carSale?: string;
  carRent?: string;
  trailer?: string;
  carParts?: string;
  truck?: string;
  electricCar?: string;
  motoSale?: string;
  motoRent?: string;
  motoParts?: string;
  motoOther?: string;
  boatSale?: string;
  boatRent?: string;
  boatEngine?: string;
  boatParts?: string;
  tractorSale?: string;
  agriTool?: string;
  fertilizer?: string;
  harvester?: string;
  fullTime?: string;
  partTime?: string;
  freelance?: string;
  // Updated Subscription Tiers
  subStandard?: string;
  subStandard60?: string;
  subPremium?: string;
  subSixMonth?: string;
  subPremiumYear?: string;
  // Fees and Status
  taxRate?: string;
  platformFee?: string;
  waafi?: string;
  currency?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
}

export interface CalculatedFee {
  type: string | number;
  isFree: boolean;
  baseFee: number;
  taxAmount: number;
  platformFee: number;
  waafiFee: number;
  totalAmount: number;
  currency: string;
}

export interface CreateFeePayload {
  name: string;
  amount: number;
  currency: string;
}

export interface CalculateFeePayload {
  category: keyof AppCategories;
  price: number;
}

const CATEGORY_MAP: AppCategories = {
  marketplace: String(LISTING_TYPES.FEE),
  car: String(LISTING_TYPES.FEE),
  realestate: String(LISTING_TYPES.FEE),
  boat: String(LISTING_TYPES.FEE),
  motorcycle: String(LISTING_TYPES.FEE),
  traktor: String(LISTING_TYPES.FEE),
  advertisement: String(LISTING_TYPES.FEE),
  subscription: String(LISTING_TYPES.FEE),
};

export const getActiveFee = async (): Promise<FeeConfig> => {
  const response = await fetch(FEE_ENDPOINTS.GET_ACTIVE);
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch active fee`);
  return response.json();
};

export const getAllFees = async (): Promise<FeeConfig[]> => {
  const response = await fetch(FEE_ENDPOINTS.GET_ALL);
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch fee history`);
  return response.json();
};

export const getFeeChangeLogs = async (id: string): Promise<FeeConfig[]> => {
  const response = await fetch(FEE_ENDPOINTS.GET_LOGS(id));
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch logs`);
  return response.json();
};

export const createFee = async (data: any): Promise<FeeConfig> => {
  const response = await fetch(FEE_ENDPOINTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to create fee");
  return result;
};

export const updateFee = async (id: string, data: any): Promise<FeeConfig> => {
  const response = await fetch(FEE_ENDPOINTS.UPDATE(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to update fee`);
  return response.json();
};

export const deleteFee = async (id: string): Promise<boolean> => {
  const response = await fetch(FEE_ENDPOINTS.DELETE(id), {
    method: "DELETE",
  });
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to delete fee`);
  return true;
};

export const getTotalFee = async (
  category: keyof AppCategories,
  type: string
): Promise<number> => {
  const response = await fetch(
    `${FEE_ENDPOINTS.TOTAL_FEE}?category=${category}&type=${type}`
  );
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch total fee`);
  return response.json();
};

export const getFeeStats = async (): Promise<Record<string, number>> => {
  const response = await fetch(FEE_ENDPOINTS.STATS);
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to fetch stats`);
  return response.json();
};

export const calculateApiFee = async (
  params: CalculateFeePayload
): Promise<CalculatedFee> => {
  const response = await fetch(FEE_ENDPOINTS.CALCULATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: Failed to calculate fee`);
  return response.json();
};

export const calculateLocalFee = (
  feeConfig: FeeConfig,
  category: keyof AppCategories = "subscription",
  subType?: keyof Pick<
    FeeConfig,
    | "subStandard"
    | "subStandard60"
    | "subPremium"
    | "subSixMonth"
    | "subPremiumYear"
  >
): CalculatedFee => {
  const categoryLower = category.toLowerCase();
  const listingType = CATEGORY_MAP[category as keyof AppCategories];

  let baseFee = 0;

  if (categoryLower === "subscription") {
    const key = subType || "subStandard";
    baseFee = Number(feeConfig[key]) || 0;
  } else if (categoryLower === "marketplace") {
    baseFee = Number(feeConfig.electronics) || 0;
  } else {
    const key = categoryLower as keyof FeeConfig;
    baseFee = Number(feeConfig[key]) || 0;
  }

  const taxRate = Number(feeConfig.taxRate) || 0;
  const taxAmount = (baseFee * taxRate) / 100;
  const platformFee = Number(feeConfig.platformFee) || 0;
  const waafiFee = Number(feeConfig.waafi) || 0;

  const totalAmount = baseFee + taxAmount + platformFee + waafiFee;
  const isFree = totalAmount <= 0;

  return {
    type: isFree ? LISTING_TYPES.FREE : Number(listingType),
    isFree: isFree,
    baseFee: Number(baseFee.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    platformFee,
    waafiFee,
    totalAmount: Number(totalAmount.toFixed(2)),
    currency: feeConfig.currency || "USD",
  };
};
