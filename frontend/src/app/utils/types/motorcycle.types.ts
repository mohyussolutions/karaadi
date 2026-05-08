export interface MotorcycleItem {
  _id?: string;
  id?: string;
  user?: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  region?: string;
  condition?: "New" | "Used";
  make?: string;
  model?: string;
  year?: number;
  engineSize?: string;
  mileage?: number;
  images?: string[];
  isPaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MotorcycleState {
  items: MotorcycleItem[];
  selectedItem: MotorcycleItem | null;
  loading: boolean;
  error: string | null;
}
import { Motorcycle } from "@/app/utils/types/motorcycles.types";

export interface AdminMotorcycle {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  region?: string;
  images?: string[];
  isPaid?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?:
    | {
        _id?: string;
        id?: string;
        username?: string;
        email?: string;
        phone?: string;
        profileImage?: string;
      }
    | string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: "New" | "Used";
  engineSize?: string;
  transmission?: string;
  color?: string;
}

export type AdminMotorcyclePartial = Partial<Motorcycle> & {
  user?:
    | {
        _id?: string;
        id?: string;
        username?: string;
        email?: string;
        phone?: string;
        profileImage?: string;
      }
    | string;
  subCategory?: string;
};
