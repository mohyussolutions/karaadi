export interface FeedItem {
  id: string | number;
  _id?: string | number;
  title?: string;
  price?: number;
  images?: string[];
  category?: string;
  priority?: "premium90" | "standard60" | "basic30";
  description?: string | string[];
  city?: string;
  [key: string]: unknown;
}
