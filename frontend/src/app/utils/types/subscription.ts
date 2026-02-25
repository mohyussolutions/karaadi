export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
}

export interface Subscription {
  _id: string;
  id?: string;
  userId: User | string;
  title: string;
  category: string;
  subCategory?: string;
  description?: string;
  region: string;
  cities: string[];
  selectedCityIds?: string[];
  customCities?: string[];
  priceMin?: number;
  priceMax?: number;
  totalFee?: number;
  isPaid?: boolean;
  isActive: boolean;
  status: string;
  lastNotified?: string;
  notificationCount: number;
  condition?: string;
  brand?: string;
  model?: string;
  specificFeatures?: string;
  metadata?: any;
  createdAt: string;
  updatedAt?: string;
  expiryDate?: string;
}

export interface SubscriptionFilters {
  search: string;
  status: string;
  region: string;
  category: string;
  dateFrom: string;
  dateTo: string;
}

export interface SubscriptionDetailModalProps {
  subscription: Subscription;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
  onUpdateStatus: (id: string, status: string) => Promise<void> | void;
}

export interface FilterSectionProps {
  filters: SubscriptionFilters;
  regions: string[];
  categories: string[];
  filteredCount: number;
  onFilterChange: (key: keyof SubscriptionFilters, value: string) => void;
  onClearFilters: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
}
