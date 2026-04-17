import type { ID } from "./common.types";
import type { User } from "./user.types";

export interface MarketplaceItem {
  id: ID;
  _id: ID;
  title: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  image: string;
  category: string;
  subcategory: string;
  region: string;
  location: string;
  city: string;
  ownerId: ID;
  userId: ID;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: "available" | "sold" | "pending";
  isPaid: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  feeAmount?: number;
  planPrice?: number;
}

export interface AdminMarketplaceItem extends MarketplaceItem {
  adminNotes: string;
  mainCategory: string;
  user?: User;
}

export interface CreateMarketplaceData {
  title: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subcategory: string;
  region: string;
  city: string;
  userId: ID;
  feeAmount?: number;
  planPrice?: number;
}

export type CreateMarketplacePayload = CreateMarketplaceData;

export interface MarketplaceFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "available" | "sold" | "pending";
  category?: string;
  subcategory?: string;
  region?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface MarketplaceApiResponse {
  items: MarketplaceItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MarketplaceState {
  items: MarketplaceItem[];
  selectedItem: MarketplaceItem | null;
  createdPayload: MarketplaceItem | null;
  loading: boolean;
  error: string | null;
}

export const initialState: MarketplaceState = {
  items: [],
  selectedItem: null,
  createdPayload: null,
  loading: false,
  error: null,
};
