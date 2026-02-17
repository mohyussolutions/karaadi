export type Motorcycle = {
  id: string;
  userId: string;
  title: string;
  transmission?: string;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  price: number;
  so?: string;
  region: string;
  city: string;
  district: string;
  subDistrict: string;
  images: string[];
  type: string;
  make: string;
  modelName: string;
  year: number;
  mileage: number;
  engineSize: string;
  fuelType: string;
  color: string;
  description: string;
  maGaday: boolean;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
};

export type MotorcyclesState = {
  motorcycles: Motorcycle[];
};
