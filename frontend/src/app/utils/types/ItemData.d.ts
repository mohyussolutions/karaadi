export interface ItemData {
  id: string | number;
  _id?: string | number;
  title?: string;
  description?: string;
  city?: string;
  location?: string;
  area?: string;
  address?: string;
  region?: string;
  price?: number;
  images?: string[];
  maGaday?: boolean;
  category: string;
  categoryKey?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  rooms?: number;
  company?: string;
}
