import type { CalculatedFee } from "@/actions/categories/feeAction";

export type RealEstate = {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  address: string;
  hasGarage?: boolean;
  hasGarden?: boolean;
  region: string;
  so?: string;
  city: string;
  county: string;
  district: string;
  subDistrict: string;
  images: string[];
  maGaday: boolean;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  fee: CalculatedFee | null;
};

export type RealEstateState = {
  realEstates: RealEstate[];
};
