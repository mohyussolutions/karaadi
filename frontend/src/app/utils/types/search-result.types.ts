export interface SearchResult {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string;
  mainCategory?: string;
  subcategory?: string | string[];
  user?: {
    username?: string;
    phone?: string;
    _id?: string;
  };
  isPaid?: boolean;
  [key: string]: any;
}
