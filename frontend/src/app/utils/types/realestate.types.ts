import type { ID } from "./common.types";

export interface RealEstate {
  id: ID;
  _id?: ID;
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  region?: string;
  city?: string;
  county?: string;
  images?: string[];
  type?: string;
  category?: string;
  subCategory?: string;
  mainCategory?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  isPaid?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  expiryDate?: string | null;
  planId?: string | null;
  planAmount?: number;
  plan?: { basic30?: number; standard60?: number; premium90?: number } | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    username?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
}

export interface RealEstateState {
  items: RealEstate[];
  selectedItem: RealEstate | null;
  loading: boolean;
  error: string | null;
}
