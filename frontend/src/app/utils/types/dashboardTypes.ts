export type { ManagementSection, ProtectedRoute } from "./managementTypes";

export interface SinglePlanConfig {
  name: string;
  duration: string;
  badge: string;
  features: string[];
}

export interface B2BPlanConfig {
  basic30: SinglePlanConfig;
  standard60: SinglePlanConfig;
  premium90: SinglePlanConfig;
  standard180: SinglePlanConfig;
  annual365: SinglePlanConfig;
}
