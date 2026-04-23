export interface CreatePaymentData {
  amount: number;
  userId: string;
  method?: string;
  description?: string;
  itemId?: string;
  itemType?: string;
}

interface ListingSnippet {
  title?: string;
  images?: string[];
}

export interface Payment {
  id: string;
  _id?: string;
  amount?: number;
  totalAmount?: number;
  status: "pending" | "completed" | "failed" | "refunded" | "success" | "PENDING" | "COMPLETED" | "FAILED";
  userId: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
  };
  method?: string;
  paymentMethod?: string;
  payerPhone?: string;
  description?: string;
  transactionId?: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
  boatId?: string;
  carId?: string;
  realEstateId?: string;
  motorcycleId?: string;
  farmequipmentId?: string;
  marketplaceId?: string;
  jobId?: string;
  subscriptionId?: string;
  currency?: string;
  boat?: ListingSnippet;
  car?: ListingSnippet;
  realEstate?: ListingSnippet;
  motorcycle?: ListingSnippet;
  farmequipment?: ListingSnippet;
  marketplace?: ListingSnippet;
  job?: ListingSnippet;
}

export interface PaginatedPayments {
  items: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface UpdatePaymentStatusData {
  status: "pending" | "completed" | "failed" | "success";
  transactionId?: string;
}

export interface PaymentStats {
  totalRevenue: number;
  paymentCount: number;
  totalPayments?: number;
  totalAmount?: number;
  completedPayments?: number;
  failedPayments?: number;
  pendingPayments?: number;
}

export interface PaymentItem {
  id: string;
  amount: number;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
