export interface SubscriptionUser {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

export interface Subscription {
  id?: string;
  _id?: string;
  userId?: string | SubscriptionUser;
  title?: string;
  category?: string;
  subCategory?: string;
  region?: string;
  cities?: string[];
  isPaid?: boolean;
  isActive?: boolean;
  status?: "active" | "inactive" | "pending";
  createdAt?: string;
  updatedAt?: string;
  priceMin?: number;
  priceMax?: number;
  notificationCount?: number;
  customCities?: string[];
  lastNotified?: string;
  totalFee?: number;
  brand?: string;
  model?: string;
  condition?: string;
}

export interface SubscriptionFilters {
  search: string;
  status: string;
  region: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

export interface FilterSectionProps {
  filters: SubscriptionFilters;
  regions: string[];
  categories: string[];
  filteredCount: number;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}

export interface AdminSubscriptionsPageProps {
  accessToken?: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  inactive: number;
  recent: number;
}
