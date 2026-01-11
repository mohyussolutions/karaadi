import {
  ListingType,
  ItemCategory,
  Payment as PrismaPayment,
} from "@prisma/client";
import { FEE_KEYS } from "config/contstanst.ts";

export { ListingType, ItemCategory };

export type FeeConfigKeyType = (typeof FEE_KEYS)[number];

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  WAAFI = "WAAFI",
  EVC = "EVC",
  SAHAL = "SAHAL",
  EVPLUS = "EVPLUS",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface PaymentProcessingResult {
  success: boolean;
  message?: string;
  payment?: PrismaPayment;
  transactionId?: string;
  error?: string;
  details?: {
    waafiResponseCode?: string;
    error?: string;
    [key: string]: unknown;
  };
}

export interface WaafiRawResponse {
  responseCode?: string | number;
  errorCode?: string | number;
  responseMsg?: string;
  errorMsg?: string;
  details?: string;
  params?: {
    state?: string;
    transactionId?: string | number;
  };
}

export interface WaafiError {
  message: string;
  error: string;
  responseCode?: string;
  params?: Record<string, unknown>;
  isSuccess: boolean;
}

export type ProcessWaafiPayment = (
  userId: string,
  itemCategory: ItemCategory,
  itemId: string,
  listingType: ListingType,
  paymentMethod: PaymentMethod,
  accountNo: string,
  totalAmount: number,
  taxAmount: number,
  platformFeeAmount: number,
  description: string,
  baseFee: number,
  feeAmount: number,
  currency?: string,
  metadata?: Record<string, unknown>,
  customFields?: Record<string, unknown>
) => Promise<PaymentProcessingResult>;
