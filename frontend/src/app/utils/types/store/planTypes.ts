export interface Plan {
  id: string;
  key?: string;
  label?: string;
  type?: number;
  days: number;
  price: number;
  name: string;
  iconName?: string;
  popular?: boolean;
  calculatedFee?: CalculatedFee;
}

export interface CalculatedFee {
  baseFee: number;
  currency: string;
}

export interface FeeConfig {
  currency: string;
  [planId: string]: number | string;
}

export interface PlansState {
  items: Plan[];
  userSelection: Plan | null;
  loading: boolean;
}

export interface PlanState {
  userSelection: any | null;
}
