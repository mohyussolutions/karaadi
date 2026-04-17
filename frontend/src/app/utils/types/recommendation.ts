export interface CategoryCTR {
  category: string;
  ctr: number;
}

export interface CategoryStats {
  category: string;
  count: number;
}
export interface RecommendationItem {
  id: string;
  externalId: string;
  category: string;
  title: string;
  description?: string;
  price?: string | number;
  views?: number;
  [key: string]: any;
}

export interface CreateRecommendationData {
  userId: string;
  content: string;
}
