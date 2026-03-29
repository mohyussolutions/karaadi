import { z } from "zod";
import { PaymentStatus, ListingType } from "@prisma/client";

export const paymentValidation = z.object({
  userId: z.string().cuid(),
  transactionId: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  currency: z.string().default("USD"),
  feeAmount: z.number().default(0.0),
  planAmount: z.number().default(0.0),
  taxAmount: z.number().default(0.0),
  platformFee: z.number().default(0.0),
  totalAmount: z.number().default(0.0),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  listingType: z.nativeEnum(ListingType).default(ListingType.FEE),
  marketplaceId: z.string().optional().nullable(),
  realEstateId: z.string().optional().nullable(),
  boatId: z.string().optional().nullable(),
  carId: z.string().optional().nullable(),
  motorcycleId: z.string().optional().nullable(),
  farmequipmentId: z.string().optional().nullable(),
  jobId: z.string().optional().nullable(),
  subscriptionId: z.string().optional().nullable(),
  marketplaceFeeId: z.string().optional().nullable(),
  realEstateFeeId: z.string().optional().nullable(),
  boatFeeId: z.string().optional().nullable(),
  carFeeId: z.string().optional().nullable(),
  motorcycleFeeId: z.string().optional().nullable(),
  equipmentFeeId: z.string().optional().nullable(),
  planConfigId: z.string().optional().nullable(),
});

export type PaymentValidationType = z.infer<typeof paymentValidation>;
