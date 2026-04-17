export interface FeedItem {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  images?: string[];
  price?: number;
  city?: string;
  category?: string | string[];
}
