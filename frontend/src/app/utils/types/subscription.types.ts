export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
}

export interface ItemDetails {
  title: string;
  description: string;
  images?: string[];
}

export interface BudgetRange {
  min: number;
  max: number;
}

export interface Location {
  city: string;
  region?: string;
  country?: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export type PaymentStatus = "pending" | "paid" | "failed";

export interface SubscriptionState {
  subscriptionPlan: SubscriptionPlan | null;
  itemCategory: string | null;
  itemDetails: ItemDetails | null;
  budgetRange: BudgetRange | null;
  location: Location | null;
  contactInfo: ContactInfo | null;
  paymentStatus: PaymentStatus | null;
  expiryDate: string | null;
}
