export interface PlanSelection {
  planId: string;
  amount?: number;
  itemId?: string;
}

export interface PlanState {
  selectedPlan: PlanSelection | null;
}
