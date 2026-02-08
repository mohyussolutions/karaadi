export enum ItemCategory {
  CAR = "CAR",
  BOAT = "BOAT",
  REAL_ESTATE = "REAL_ESTATE",
  MOTORCYCLE = "MOTORCYCLE",
  TRAKTOR = "TRAKTOR",
  MARKETPLACE = "MARKETPLACE",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum PaymentMethod {
  WAAFI = "WAAFI",
  EVC = "EVC",
  SAHAL = "SAHAL",
  EVPLUS = "EVPLUS",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export interface PaymentUser {
  id: string;
  username: string;
  email: string | null;
  phone?: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  user?: PaymentUser;
  paymentMethod: string;
  transactionId?: string | null;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  paidAt?: string | Date | null;
  listingType: string;
  itemCategory?: string | null;
  region?: string | null;
  city?: string | null;
  carId?: string | null;
  realEstateId?: string | null;
  boatId?: string | null;
  motorcycleId?: string | null;
  traktorId?: string | null;
  marketplaceId?: string | null;
  subscriptionId?: string | null;
  baseFee: number;
  feeAmount: number;
  taxAmount: number;
  platformFee: number;
  currency: string;
  accountNo?: string | null;
  description?: string | null;
  notes?: string | null;
}

export interface CreatePaymentData {
  userId: string;
  itemCategory: ItemCategory;
  itemId: string;
  listingType?: string;
  paymentMethod: PaymentMethod;
  accountNo?: string;
  description?: string;
  feeAmount?: number;
  baseFee?: number;
  taxAmount?: number;
  platformFee?: number;
  currency?: string;
  region?: string;
  city?: string;
}

export interface UpdatePaymentStatusData {
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
}

export interface PaymentBreakdownBase {
  _count: { id: number };
  _sum: { totalAmount: number };
}

export interface PaymentStats {
  summary: {
    totalAmount: number;
    totalPayments: number;
    averagePayment: number;
    totalTax: number;
    totalPlatformFee: number;
    totalBaseFee: number;
    totalFee: number;
  };
  breakdown: {
    status: (PaymentBreakdownBase & { status: string })[];
    paymentMethods: (PaymentBreakdownBase & { paymentMethod: string })[];
    categories?: (PaymentBreakdownBase & { itemCategory: string })[];
    regions: (PaymentBreakdownBase & { region: string })[];
    cities: (PaymentBreakdownBase & { city: string })[];
  };
  geography?: {
    regionStats: Record<
      string,
      {
        totalAmount: number;
        count: number;
        cities: Record<string, { totalAmount: number; count: number }>;
      }
    >;
  };
}

export interface PaginatedPayments {
  payments: Payment[];
  total: number;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
