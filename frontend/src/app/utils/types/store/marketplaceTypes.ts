export type Marketplace = {
  id: string;
  userId: string;
  title: string;
  so?: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  district: string;
  subDistrict?: string;
  images: string[];
  extra?: any;
  maGaday: boolean;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
};

export type MarketplaceState = {
  items: Marketplace[];
};
