import { ListingType } from "@prisma/client";
import { PaymentStatus } from "./payment.ts";

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
