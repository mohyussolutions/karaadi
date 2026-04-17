import { ListingType } from "@prisma/client";

export enum PaymentMethod {
  WAAFI = "WAAFI",
  CARD = "CARD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ItemCategory {
  CAR = "CAR",
  MOTORCYCLE = "MOTORCYCLE",
  REAL_ESTATE = "REAL_ESTATE",
  BOAT = "BOAT",
  MARKETPLACE = "MARKETPLACE",
  JOB = "JOB",
  FARMEQUIPMENT = "FARMEQUIPMENT",
}

export interface PaymentRequest {
  itemId: string;
  itemCategory: ItemCategory;
  accountNo?: string;
  paymentMethod?: PaymentMethod;
  paymentIntentId?: string;
  currency?: string;
  amount?: number;
  totalAmount?: number;
  feeAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  baseFee?: number;
  description?: string;
  listingType?: ListingType;
}

export interface ExtendedPaymentRequest extends PaymentRequest {
  userId: string;
}

export interface PaymentUpdateBody {
  paymentId?: string;
  planId?: string;
  isPaid?: boolean;
  planAmount?: number;
  planType?: string;
}

export interface PaymentRequestBody {
  payment?: any;
  userId?: string;
  itemId?: string;
  itemCategory?: ItemCategory;
  listingType?: ListingType;
  [key: string]: any;
}

export interface PaymentData {
  id?: string;
  userId: string;
  transactionId?: string;
  paymentMethod?: string;
  currency?: string;
  feeAmount?: number;
  planAmount?: number;
  taxAmount?: number;
  platformFee?: number;
  totalAmount?: number;
  status?: PaymentStatus;
  listingType?: ListingType;
  createdAt?: Date;
  updatedAt?: Date;
  paidAt?: Date | null;
  marketplaceId?: string;
  realEstateId?: string;
  boatId?: string;
  carId?: string;
  motorcycleId?: string;
  farmequipmentId?: string;
  jobId?: string;
  subscriptionId?: string;
  marketplaceFeeId?: string;
  realEstateFeeId?: string;
  boatFeeId?: string;
  carFeeId?: string;
  motorcycleFeeId?: string;
  equipmentFeeId?: string;
  planConfigId?: string;
}
