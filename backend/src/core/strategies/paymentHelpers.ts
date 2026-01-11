import { ItemCategory, PaymentStatus, ListingType } from "@prisma/client";
import prisma from "core/utils/db.ts";
import { PaymentMethod } from "types/payment.ts";

export const truncateAmount = (amount: number): string => {
  return (Math.floor(amount * 100) / 100).toFixed(2);
};

export const generateTransactionId = (prefix: string): string => {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9.-]/g, "");
  return `${cleanPrefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)}`.toUpperCase();
};

export const createPaymentWithCategory = async (
  userId: string,
  itemCategory: ItemCategory,
  itemId: string,
  listingType: ListingType,
  paymentMethod: PaymentMethod,
  totalAmount: number,
  transactionId?: string,
  taxAmount: number = 0,
  platformFee: number = 0,
  feeAmount: number = 0,
  baseFee: number = 0,
  currency: string = "USD",
  metadata?: any,
  customFields?: any
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const categoryFieldMap: Record<ItemCategory, string> = {
    [ItemCategory.CAR]: "carId",
    [ItemCategory.BOAT]: "boatId",
    [ItemCategory.REAL_ESTATE]: "realEstateId",
    [ItemCategory.MOTORCYCLE]: "motorcycleId",
    [ItemCategory.TRAKTOR]: "traktorId",
    [ItemCategory.MARKETPLACE]: "marketplaceId",
    [ItemCategory.SUBSCRIPTION]: "subscriptionId",
  };

  const modelMap: Record<string, any> = {
    [ItemCategory.CAR]: prisma.car,
    [ItemCategory.BOAT]: prisma.boat,
    [ItemCategory.REAL_ESTATE]: prisma.realEstate,
    [ItemCategory.MOTORCYCLE]: prisma.motorcycle,
    [ItemCategory.TRAKTOR]: prisma.traktor,
    [ItemCategory.MARKETPLACE]: prisma.marketplace,
    [ItemCategory.SUBSCRIPTION]: prisma.subscription,
  };

  const itemExists = await modelMap[itemCategory].findUnique({
    where: { id: itemId },
  });

  if (!itemExists) {
    throw new Error(`The ${itemCategory} with ID ${itemId} does not exist.`);
  }

  const paymentData: any = {
    userId,
    listingType,
    feeAmount,
    baseFee,
    taxAmount,
    platformFee,
    totalAmount,
    currency,
    paymentMethod: paymentMethod as any,
    transactionId,
    status: transactionId ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
    paidAt: transactionId ? new Date() : null,
  };

  if (metadata) paymentData.metadata = metadata;
  if (customFields) paymentData.customFields = customFields;

  const categoryField = categoryFieldMap[itemCategory];
  if (categoryField) paymentData[categoryField] = itemId;

  return prisma.payment.create({ data: paymentData });
};

export const updateItemStatus = async (
  itemCategory: ItemCategory,
  itemId: string,
  isPaid: boolean
): Promise<void> => {
  const modelMap: Record<string, any> = {
    [ItemCategory.CAR]: prisma.car,
    [ItemCategory.BOAT]: prisma.boat,
    [ItemCategory.REAL_ESTATE]: prisma.realEstate,
    [ItemCategory.MOTORCYCLE]: prisma.motorcycle,
    [ItemCategory.TRAKTOR]: prisma.traktor,
    [ItemCategory.MARKETPLACE]: prisma.marketplace,
    [ItemCategory.SUBSCRIPTION]: prisma.subscription,
  };

  const model = modelMap[itemCategory];
  if (!model) return;

  await model.update({
    where: { id: itemId },
    data: { isPaid },
  });
};
