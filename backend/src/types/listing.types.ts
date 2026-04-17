export interface AdQuery {
  position?: string;
  limit?: string;
  page?: string;
}

export interface BoatQuery {
  type?: string;
  region?: string;
  city?: string;
  subCategory?: string;
  category?: string;
}

export interface CreateBoatBody {
  userId: string;
  feeId?: string;
  planId?: string;
  title: string;
  mainCategory: string;
  category: string | string[];
  subcategory: string | string[];
  images: string[];
  price: number;
  feeAmount: number;
  planAmount: number;
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  region: string;
  city: string;
  so?: string;
  description: string;
}

export interface CarQuery {
  type?: string;
  listingType?: string;
  region?: string;
  city?: string;
  district?: string;
  subcategory?: string;
  category?: string;
}

export interface CreateCarBody {
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  brand: string;
  vehicleModel: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  color: string;
  region: string;
  city: string;
  images: string[];
  so?: string;
  isPaid?: boolean;
  planId?: string;
  planAmount?: number;
  feeId?: string;
  feeAmount?: number;
}

export interface CreateFarmequipmentBody {
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  make: string;
  farmequipmentModel: string;
  type: string;
  condition: string;
  enginePower: string;
  fuelType: string;
  year: number;
  hours?: number;
  images: string[];
  isPaid?: boolean;
  planId?: string;
  planAmount?: number;
  userId?: string;
}

export interface SubscriptionMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export type ItemModels =
  | "marketplace"
  | "car"
  | "realestate"
  | "boat"
  | "motorcycle"
  | "farmequipment"
  | "advertisement";

export interface ItemData {
  title: string;
  price: number;
  mainCategory: string;
  subCategory?: string;
  region: string;
  city: string;
  brand?: string;
  model?: string;
  condition?: string;
  posterId: string;
}

export interface CreateSubscriptionBody {
  userId: string;
  title: string;
  category: string | string[];
  subCategory?: string;
  region: string;
  cities: string | string[];
  priceMin?: string;
  priceMax?: string;
  brand?: string;
  model?: string;
  totalFee?: number;
  condition?: string;
  specificFeatures?: string;
}

export interface UpdateStatusBody {
  status: "active" | "inactive" | "paused";
  isActive?: boolean;
}

export interface TriggerNotificationBody {
  itemType: ItemModels;
  itemId: string;
  title: string;
  price: number;
  mainCategory: string;
  subCategory?: string;
  region: string;
  city: string;
  brand?: string;
  model?: string;
  condition?: string;
  posterId: string;
}
