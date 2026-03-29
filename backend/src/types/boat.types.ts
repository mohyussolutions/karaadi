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
