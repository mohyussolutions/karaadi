export interface UniversalCardProps {
  id?: string | number;
  _id?: string | number;
  title?: string;
  price?: number | string;
  city?: string;
  images?: string[];
  description?: string;
  category?: string;
  subcategory?: string;
  linkHref?: string;
  href?: string;
  maGaday?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  priority?: boolean;
  type?: string;
  [key: string]: unknown;
}
