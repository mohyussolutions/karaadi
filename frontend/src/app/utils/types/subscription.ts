export interface Subscription {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
  };
  title: string;
  category: string;
  subCategory?: string;
  region: string;
  city: string;
  priceMin?: number;
  priceMax?: number;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  lastNotified?: string;
  notificationCount?: number;
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
