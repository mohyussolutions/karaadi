export type CategoryKey =
  | "realestate"
  | "motor"
  | "motorcycles"
  | "boats"
  | "farmequipment"
  | "marketplace"
  | "schools";

export type Business = {
  id: string;
  userId: string;
  name: string;
  orgNumber?: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  logo?: string;
  images?: string[];
  description?: string;
  categories: string[];
  contactName?: string;
  planType?: string;
  planId?: string;
  planStartDate?: string;
  status: string;
  isVerified: boolean;
  isPaid: boolean;
  isAdminEnabled: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  currentListings?: number;
  maxListingsOverride?: number | null;
  plan?: {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    features: string[];
    maxListings: number;
  };
  owner?: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  members?: { id: string; username: string; email: string }[];
};

export type BusinessPlan = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  maxListings: number;
  categories: string[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Listing = {
  id: string;
  title: string;
  images?: string[];
  category?: string | string[];
  mainCategory?: string;
  city?: string;
  price?: number;
  maGaday?: boolean;
};
