
export interface ListingPlan {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  features: string[];
}

export interface ListingPlanData {
  plan: string;
  billingCycle: "monthly" | "yearly";
}

export interface ListingPlanSelectorProps {
  planData: ListingPlanData;
  onChange: (field: keyof ListingPlanData, value: string) => void;
  errors: Record<string, string>;
}

export interface SubscriptionFormData {
  plan: string;
  billingCycle: "monthly" | "yearly";
  userId?: string;
  title?: string;
  mainCategory?: string;
  category?: string;
  subCategory?: string;
  priceMin?: string;
  priceMax?: string;
  region?: string;
  city?: string;
  description?: string;
  specificFeatures?: string;
  condition?: string;
  brand?: string;
  model?: string;
}
