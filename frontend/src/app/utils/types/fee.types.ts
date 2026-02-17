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
  subStandard?: string;
  subStandard60?: string;
  subPremium?: string;
  subSixMonth?: string;
  subPremiumYear?: string;
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

export const CATEGORY_MAP: AppCategories = {
  marketplace: String(LISTING_TYPES.FEE),
  car: String(LISTING_TYPES.FEE),
  realestate: String(LISTING_TYPES.FEE),
  boat: String(LISTING_TYPES.FEE),
  motorcycle: String(LISTING_TYPES.FEE),
  traktor: String(LISTING_TYPES.FEE),
  advertisement: String(LISTING_TYPES.FEE),
  subscription: String(LISTING_TYPES.FEE),
};
