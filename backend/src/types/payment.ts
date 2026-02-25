import { ListingType } from "@prisma/client";

export { ListingType };

export enum ItemCategory {
  CAR = "CAR",
  BOAT = "BOAT",
  REAL_ESTATE = "REAL_ESTATE",
  MOTORCYCLE = "MOTORCYCLE",
  MARKETPLACE = "MARKETPLACE",
  FARMEQUIPMENT = "FARMEQUIPMENT",
  JOB = "JOB",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  WAAFI = "WAAFI",
  EVC = "EVC",
  SAHAL = "SAHAL",
  EVPLUS = "EVPLUS",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  CASH = "CASH",
}

export interface PaymentUser {
  id: string;
  username: string;
  email: string | null;
  phone?: string | null;
}

export interface PaymentProcessingResult {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
  payment?: any;
  amount?: number;
  responseCode: number;
  key: string;
}

export interface PaymentBreakdownBase {
  _count: { id: number };
  _sum: { totalAmount: number };
}

export interface PaymentStats {
  summary: {
    totalAmount: number;
    totalPayments: number;
    averagePayment?: number;
    minPayment?: number;
    maxPayment?: number;
    totalTax: number;
    totalPlatformFee: number;
    totalFee: number;
  };
  breakdown: {
    status: Array<{ status: string } & PaymentBreakdownBase>;
    paymentMethods: Array<{ paymentMethod: string } & PaymentBreakdownBase>;
    regions: Array<{ region: string } & PaymentBreakdownBase>;
    cities: Array<{ city: string } & PaymentBreakdownBase>;
  };
}

export interface PaymentRequest {
  userId?: string;
  itemCategory: ItemCategory;
  itemId: string;
  listingType?: ListingType;
  paymentMethod?: PaymentMethod;
  accountNo?: string;
  totalAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  description?: string;
  baseFee?: number;
  feeAmount?: number;
  currency?: string;
}
