import type { ID } from "./common.types";

export interface FarmEquipment {
  _id: ID;
  id: ID;
  userId: ID;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  type: string;
  make: string;
  farmequipmentModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  region: string;
  city: string;
  images: string[];
  isPaid: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string | null;
  user?: {
    username: string;
    email: string;
    phone: string;
    profileImage?: string;
  };
}
export interface AdminFarmEquipmentItem extends FarmEquipment {
  adminNotes?: string;
}

export interface CreateFarmEquipmentPayload {
  title: string;
  description: string;
  price: number;
  images: string[];
  mainCategory: string;
  category: string[];
  subcategory: string[];
  type: string;
  make: string;
  farmequipmentModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  region: string;
  city: string;
  userId: ID;
  isPaid?: boolean;
  planId?: string;
  planAmount?: number;
}

export interface FarmEquipmentFilters {
  search?: string;
  mainCategory?: string;
  category?: string;
  subcategory?: string;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  isPaid?: boolean;
  page?: number;
  limit?: number;
}

export interface FarmEquipmentApiResponse {
  items: FarmEquipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FarmState {
  items: FarmEquipment[];
  selectedItem: FarmEquipment | null;
  createdPayload: FarmEquipment | null;
  loading: boolean;
  error: string | null;
}

export type CreateFarmEquipmentData = CreateFarmEquipmentPayload;
