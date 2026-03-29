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

export enum ListingType {
  FREE = "FREE",
  FEE = "FEE",
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
