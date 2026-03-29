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

export interface PaymentUpdateBody {
  paymentId?: string;
  planId?: string;
}
