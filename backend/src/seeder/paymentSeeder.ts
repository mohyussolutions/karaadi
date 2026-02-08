export interface PaymentItem {
  userId: string;
  itemCategory:
    | "CAR"
    | "REAL_ESTATE"
    | "BOAT"
    | "MOTORCYCLE"
    | "TRAKTOR"
    | "MARKETPLACE"
    | "SUBSCRIPTION";
  itemId: string;
  listingType: "premium" | "standard" | "basic";
  paymentMethod: "WAAFI" | "EVC" | "SAHAL" | "EVPLUS" | "BANK_TRANSFER";
  accountNo: string;
  description: string;
  feeAmount: number;
  baseFee: number;
  taxAmount: number;
  platformFee: number;
  currency: string;
}

export interface BulkPaymentRequest {
  payments: PaymentItem[];
}
export const SEED_PAYMENTS: PaymentItem[] = [
  {
    userId: "user_id_1",
    itemCategory: "CAR",
    itemId: "car_id_1",
    listingType: "premium",
    paymentMethod: "WAAFI",
    accountNo: "252618888888",
    description: "Premium car listing fee",
    feeAmount: 99.99,
    baseFee: 10.0,
    taxAmount: 5.5,
    platformFee: 15.0,
    currency: "USD",
  },
  {
    userId: "user_id_2",
    itemCategory: "REAL_ESTATE",
    itemId: "real_estate_id_1",
    listingType: "standard",
    paymentMethod: "EVC",
    accountNo: "252618888889",
    description: "Standard real estate listing",
    feeAmount: 199.99,
    baseFee: 20.0,
    taxAmount: 12.0,
    platformFee: 25.0,
    currency: "USD",
  },
  {
    userId: "user_id_3",
    itemCategory: "BOAT",
    itemId: "boat_id_1",
    listingType: "premium",
    paymentMethod: "SAHAL",
    accountNo: "252618888890",
    description: "Boat rental premium listing",
    feeAmount: 299.99,
    baseFee: 30.0,
    taxAmount: 18.0,
    platformFee: 35.0,
    currency: "USD",
  },
  {
    userId: "user_id_4",
    itemCategory: "MOTORCYCLE",
    itemId: "motorcycle_id_1",
    listingType: "basic",
    paymentMethod: "EVPLUS",
    accountNo: "252618888891",
    description: "Motorcycle sale listing",
    feeAmount: 49.99,
    baseFee: 5.0,
    taxAmount: 2.75,
    platformFee: 8.0,
    currency: "USD",
  },
  {
    userId: "user_id_5",
    itemCategory: "TRAKTOR",
    itemId: "traktor_id_1",
    listingType: "premium",
    paymentMethod: "BANK_TRANSFER",
    accountNo: "",
    description: "Tractor premium listing",
    feeAmount: 399.99,
    baseFee: 40.0,
    taxAmount: 24.0,
    platformFee: 45.0,
    currency: "USD",
  },
  {
    userId: "user_id_6",
    itemCategory: "MARKETPLACE",
    itemId: "marketplace_id_1",
    listingType: "standard",
    paymentMethod: "WAAFI",
    accountNo: "252618888892",
    description: "Marketplace item listing",
    feeAmount: 29.99,
    baseFee: 3.0,
    taxAmount: 1.65,
    platformFee: 5.0,
    currency: "USD",
  },
  {
    userId: "user_id_7",
    itemCategory: "SUBSCRIPTION",
    itemId: "subscription_id_1",
    listingType: "premium",
    paymentMethod: "EVC",
    accountNo: "252618888893",
    description: "Annual premium subscription",
    feeAmount: 499.99,
    baseFee: 50.0,
    taxAmount: 30.0,
    platformFee: 60.0,
    currency: "USD",
  },
  {
    userId: "user_id_8",
    itemCategory: "CAR",
    itemId: "car_id_2",
    listingType: "standard",
    paymentMethod: "SAHAL",
    accountNo: "252618888894",
    description: "Used car listing",
    feeAmount: 79.99,
    baseFee: 8.0,
    taxAmount: 4.4,
    platformFee: 12.0,
    currency: "USD",
  },
  {
    userId: "user_id_9",
    itemCategory: "REAL_ESTATE",
    itemId: "real_estate_id_2",
    listingType: "basic",
    paymentMethod: "EVPLUS",
    accountNo: "252618888895",
    description: "Apartment rental",
    feeAmount: 149.99,
    baseFee: 15.0,
    taxAmount: 9.0,
    platformFee: 20.0,
    currency: "USD",
  },
  {
    userId: "user_id_10",
    itemCategory: "BOAT",
    itemId: "boat_id_2",
    listingType: "standard",
    paymentMethod: "BANK_TRANSFER",
    accountNo: "",
    description: "Fishing boat sale",
    feeAmount: 249.99,
    baseFee: 25.0,
    taxAmount: 15.0,
    platformFee: 30.0,
    currency: "USD",
  },
];
