import { CalculatedFee } from "@/actions/categories/feeAction";

export type Car = {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  so?: string;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  listingType: string;
  brand: string;
  vehicleModel: string;
  year?: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  color: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
  maGaday: boolean;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  fee?: CalculatedFee | null;
};

export type CarsState = {
  cars: Car[];
  userSelection: Car | null;
};
