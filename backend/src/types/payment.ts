// src/types/payment.ts
import {
  ListingType,
  ItemCategory,
  Payment as PrismaPayment,
} from "@prisma/client";
import { FEE_KEYS } from "../config/contstanst.js";

export { ListingType, ItemCategory };

export type FeeConfigKeyType = (typeof FEE_KEYS)[number];

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

// Define PaymentMethod enum manually since it's not in Prisma
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
    totalBaseFee: number;
    totalFee: number;
  };
  breakdown: {
    status: Array<{ status: string } & PaymentBreakdownBase>;
    paymentMethods: Array<{ paymentMethod: string } & PaymentBreakdownBase>;
    categories: Array<{ itemCategory: string } & PaymentBreakdownBase>;
    regions: Array<{ region: string } & PaymentBreakdownBase>;
    cities: Array<{ city: string } & PaymentBreakdownBase>;
  };
}

export interface Payment extends Omit<
  PrismaPayment,
  "createdAt" | "updatedAt" | "paidAt"
> {
  user: PaymentUser;
  createdAt: string | Date;
  updatedAt: string | Date;
  paidAt: string | Date | null;
  listingType: ListingType;
  itemCategory: ItemCategory | null;
  region: string | null;
  city: string | null;
  jobId: string | null;
  carId: string | null;
  motorcycleId: string | null;
  traktorId: string | null;
  realEstateId: string | null;
  boatId: string | null;
  marketplaceId: string | null;
  subscriptionId: string | null;
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

export type PaymentMethodData = PaymentMethod;
