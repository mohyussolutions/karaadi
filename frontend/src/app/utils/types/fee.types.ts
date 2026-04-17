export interface FeeConfig {
  subscription: number;
  basic30: number;
  standard60: number;
  premium90: number;
  marketplace: number;
  electronics: number;
  cars: number;
  carSale: number;
  carRent: number;
  truck: number;
  trailer: number;
  carParts: number;
  realestate: number;
  sale: number;
  rent: number;
  land: number;
  farm: number;
  business: number;
  boats: number;
  motorcycle: number;
  farmequipment: number;
  jobs: number;
  taxRate: number;
  platformFee: number;
  waafi: number;
  currency: string;
  [key: string]: string | number;
}

export interface CalculatedFee {
  type: 0 | 1;
  isFree: boolean;
  baseFee: number;
  taxAmount: number;
  platformFee: number;
  waafiFee: number;
  totalAmount: number;
  currency: string;
}

export interface FeeCategory {
  id: string;
  name: string;
  description?: string;
  amount?: number;
}

export const LISTING_TYPES = [
  "rent",
  "sale",
  "auction",
  "lease",
  "service",
  "FREE",
] as const;

export const LISTING_TYPE = {
  RENT: "rent",
  SALE: "sale",
  AUCTION: "auction",
  LEASE: "lease",
  SERVICE: "service",
  FREE: "FREE",
} as const;

export type ListingType = (typeof LISTING_TYPES)[number];

export interface AppCategories {
  subscription: string;
  marketplace: string;
  cars: string;
  realestate: string;
  boats: string;
  motorcycle: string;
  farmequipment: string;
  jobs: string;
}

export interface FeeCalculationParams {
  feeConfig: FeeConfig;
  category: keyof FeeConfig | keyof AppCategories;
  subType?: "basic30" | "standard60" | "premium90";
}
