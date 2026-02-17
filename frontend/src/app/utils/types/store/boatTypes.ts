import { CalculatedFee } from "@/actions/categories/feeAction";

export type Boat = {
  id: string;
  userId: string;
  title: string;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  subCategoryKey?: string;
  region: string;
  city: string;
  so?: string;
  district: string;
  subDistrict?: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  boatModel: string;
  transmission: string;
  color: string;
  listingType?: string;
  maGaday: boolean;
  isPaid: boolean;
  fee?: CalculatedFee | null;
  createdAt: string;
  updatedAt: string;
};

export type BoatsState = {
  boats: Boat[];
  userSelection: Boat | null;
};
