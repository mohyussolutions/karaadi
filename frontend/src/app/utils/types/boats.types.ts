export interface BoatState {
  username: string;
  email: string;
  phone: string;
  createdPayload: import("./common.types").CreatedPayload | null;
  currentBoatId: string | null;
  paymentInfo: Record<string, any> | null;
  planId: string | null;
  planPrice: number | null;
  feeAmount: number | null;
  extraKeys: string[] | null;
}

export interface AdminBoatItem extends BoatItem {
  adminNotes?: string;
}

export interface BoatItem {
  id: string;
  title: string;
  name?: string;
  type: string;
  category: string[];
  subcategory?: string[];
  region: string;
  city: string;
  description: string;
  price: number;
  images: string[];
  boatModel: string;
  transmission: string;
  color: string;
  length?: number;
  year?: number;
  image?: string;
  ownerId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "available" | "sold" | "pending" | "active" | "expired";
  priority?: boolean;
  isPaid: boolean;
  isBasic30: boolean;
  isStandard60: boolean;
  isPremium90: boolean;
  maGaday: boolean;
  expiryDate: Date | string | null;
  feeId: string | null;
  feeAmount: number;
  planId: string | null;
  planAmount: number;
}

export interface CreateBoatPayload {
  name: string;
  type: string;
  length?: number;
  year?: number;
  price?: number;
  description?: string;
  image?: string;
}

export type CreateBoatData = CreateBoatPayload & { ownerId: string };

export interface BoatFilter {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  status?: "available" | "sold" | "pending";
}

export interface BoatApiResponse {
  boats: BoatItem[];
  total: number;
}
