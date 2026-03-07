export interface RecommendationItem {
  id: number;
  externalId: string;
  source: string;
  category: string;
  title: string;
  description?: string;
  price: string;
  views?: number;
}

export interface CategoryStats {
  category: string;
  views: number;
}

export interface CategoryCTR {
  category: string;
  totalViews: number;
  totalClicks: number;
  ctr: number;
}

export interface CreateRecommendationData {
  externalId: string;
  source: string;
  category: string;
  title: string;
  description?: string;
  price: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  id?: number;
}

export interface TrackViewData {
  externalId: string;
  category: string;
  userId?: string | null;
}

export interface RecommendationFilters {
  limit?: number;
  category?: string;
  userId?: string;
}

export interface RecommendationStats {
  totalRecommendations: number;
  totalViews: number;
  averageViewsPerItem: number;
  topCategories: CategoryStats[];
}
