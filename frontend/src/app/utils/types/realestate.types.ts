import type { ID } from "./common.types";

export interface RealEstate {
  id: ID;
  title?: string;
  description?: string;
  price?: number;
  address?: string;
  region?: string;
  city?: string;
  images?: string[];
  type?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  [key: string]: unknown;
}

export interface RealEstateState {
  items: RealEstate[];
  selectedItem: RealEstate | null;
  loading: boolean;
  error: string | null;
}
