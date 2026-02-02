import { PAYMENT_ENDPOINTS } from "../constant/constant";

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
  WAAFI = "waafi",
  EVC = "evc",
  SAHAL = "sahal",
  MANUAL = "manual",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Payment {
  id: string;
  userId: string;
  transactionId?: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  feeAmount: number;
  baseFee: number;
  taxAmount: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  listingType: string;
  description?: string;
  carId?: string;
  realEstateId?: string;
  boatId?: string;
  motorcycleId?: string;
  traktorId?: string;
  marketplaceId?: string;
  subscriptionId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  paidAt?: Date | string;
  user?: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export interface CreatePaymentData {
  userId: string;
  itemCategory: ItemCategory;
  itemId: string;
  listingType?: string;
  paymentMethod: PaymentMethod;
  accountNo?: string;
  description?: string;
}

export interface UpdatePaymentStatusData {
  status: PaymentStatus;
  transactionId?: string;
}

export interface PaymentStats {
  summary: {
    totalAmount: number;
    totalPayments: number;
    averagePayment: number;
    minPayment: number;
    maxPayment: number;
    totalTax: number;
    totalPlatformFee: number;
    totalBaseFee: number;
    totalFee: number;
  };
  breakdown: {
    status: Array<{
      status: string;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
    paymentMethods: Array<{
      paymentMethod: string;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
    categories?: Array<{
      itemCategory: string;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
  };
  trends: {
    daily: Array<{
      createdAt: Date;
      _count: { id: number };
      _sum: { totalAmount: number };
    }>;
  };
}

export interface PaginatedPayments {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const createPayment = async (
  data: CreatePaymentData,
): Promise<Payment> => {
  const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create payment");
  }

  const result = await response.json();
  return result.data.payment;
};

export const getAllPayments = async (params?: {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  itemCategory?: ItemCategory;
  userId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<PaginatedPayments> => {
  const url = new URL(PAYMENT_ENDPOINTS.GET_ALL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch payments");
  }

  const result = await response.json();
  return result.data;
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  const response = await fetch(PAYMENT_ENDPOINTS.GET_BY_ID(id));

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Payment not found");
    }
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch payment");
  }

  const result = await response.json();
  return result.data.payment;
};

export const getPaymentsByUser = async (
  userId: string,
  params?: {
    status?: PaymentStatus;
    limit?: number;
  },
): Promise<{
  payments: Payment[];
  summary: {
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
    statusSummary: Record<string, number>;
  };
}> => {
  const url = new URL(PAYMENT_ENDPOINTS.GET_BY_USER(userId));

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user payments");
  }

  const result = await response.json();
  return result.data;
};

export const getPaymentStats = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<PaymentStats> => {
  const url = new URL(PAYMENT_ENDPOINTS.STATS);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch payment statistics");
  }

  const result = await response.json();
  return result.data;
};

export const getRecentPayments = async (limit?: number): Promise<Payment[]> => {
  const url = new URL(PAYMENT_ENDPOINTS.RECENT);

  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch recent payments");
  }

  const result = await response.json();
  return result.data.payments;
};

export const updatePaymentStatus = async (
  id: string,
  data: UpdatePaymentStatusData,
): Promise<Payment> => {
  const response = await fetch(PAYMENT_ENDPOINTS.UPDATE_STATUS(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update payment status");
  }

  const result = await response.json();
  return result.data.payment;
};

export const deletePayment = async (id: string): Promise<any> => {
  try {
    const response = await fetch(PAYMENT_ENDPOINTS.DELETE(id), {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `Server Error: ${response.status}`);
    }

    return result;
  } catch (error: any) {
    throw error;
  }
};

export const verifyPayment = async (
  transactionId: string,
  paymentMethod: PaymentMethod,
): Promise<{
  valid: boolean;
  payment?: Payment;
  message: string;
}> => {
  const response = await fetch(PAYMENT_ENDPOINTS.VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transactionId, paymentMethod }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify payment");
  }

  return response.json();
};
