import type { User } from "./user.types";

export interface AdminMotorcycle {
  _id?: string;
  id?: string;
  title?: string;
  price?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  images?: string[];
  isPaid?: boolean;
  isBasic30?: boolean;
  isStandard60?: boolean;
  isPremium90?: boolean;
  expiryDate?: string | null;
  planId?: string | null;
  planAmount?: number;
  plan?: { basic30?: number; standard60?: number; premium90?: number } | null;
  user?: { username?: string; email?: string; phone?: string } | string;
}

export interface ExtendedUser extends User {
  createdAt: string;
}

export interface DashboardVisitor {
  id?: string;
  userId: string;
  ipAddress?: string;
  visitedAt: string;
}

export interface SecuritySetting {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
}

export interface SearchItem {
  query: string;
  _count: { query: number };
}

export interface SearchApiResponse {
  data?: SearchItem[];
  items?: SearchItem[];
  results?: SearchItem[];
  [key: string]: unknown;
}

export interface Report {
  id: string;
  reason: string;
  details: string | null;
  description: string | null;
  status: string;
  itemType: string;
  itemId: string;
  reporterId: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resolution: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    profileImage: string | null;
  };
  item?: {
    id: string;
    title: string;
    price?: number;
    images?: string[];
  } | null;
}

export interface ReportStats {
  total: number;
  new: number;
  inProgress: number;
  done: number;
  resolved: number;
  closed: number;
  byItemType: Array<{ itemType: string; _count: number }>;
  topReasons: Array<{ reason: string; _count: number }>;
}

export interface DailyReport {
  date: string;
  count: number;
  reports: Report[];
}

export interface ReportParams {
  page: number;
  limit: number;
  status?: string;
  itemType?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DashboardStats {
  users: number;
  visitors: number;
  messages: number;
  ads: number;
  subscriptions: number;
  regions?: number;
  cities?: number;
}

export interface MessageStats {
  total: number;
  today: number;
}

export type CategorySub = { id: string; key: string; nameEn: string; nameSo: string };
export type CategoryItem = { id: string; key: string; nameEn: string; nameSo: string; subcategories: CategorySub[] };
