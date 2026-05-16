import type { ID } from "./common.types";

export interface CarItem {
  _id: ID;
  id: ID;
  userId: ID;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  type: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  region: string;
  city: string;
  images: string[];
  isPaid: boolean;
  isActive: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  expiryDate?: string | null;
  planId?: string | null;
  planAmount?: number;
  plan?: { basic30?: number; standard60?: number; premium90?: number } | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
}

export interface CarState {
  items: CarItem[];
  selectedItem: CarItem | null;
  loading: boolean;
  error: string | null;
}

export interface CreateCarData {
  title: string;
  description: string;
  price: number;
  images: string[];
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  type: string;
  brand: string;
  vehicleModel: string;
  year: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  region: string;
  city: string;
  userId: string;
}

export interface CarFilters {
  search?: string;
  mainCategory?: string;
  category?: string;
  subcategory?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  year?: number;
  transmission?: string;
  fuelType?: string;
  isPaid?: boolean;
  page?: number;
  limit?: number;
}

export interface CarApiResponse {
  items: CarItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreateCarPayload = CreateCarData;
export type Car = CarItem;
