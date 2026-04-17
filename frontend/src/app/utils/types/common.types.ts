export type ID = string | number;
export type Timestamp = string;
export type Status = "active" | "inactive" | "pending" | "archived";
export type PaidStatus = "paid" | "unpaid" | "pending" | "failed";
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status?: Status;
}
export interface UserInfo {
  id: ID;
  name: string;
  email: string;
  phone?: string;
}
export interface Address {
  country: string;
  region?: string;
  city?: string;
  district?: string;
  street?: string;
  postalCode?: string;
}
export interface FilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatedPayload {
  id?: ID;
  user?: { name?: string; email?: string; phone?: string };
  feeAmount?: number | string;
  [key: string]: unknown;
}

export interface Rules {
  [key: string]: unknown;
}
