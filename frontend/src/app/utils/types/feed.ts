export interface FeedItem {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  city?: string;
  category?: string | string[];
  subcategory?: string | string[];
  maGaday?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  type?: string;
}
