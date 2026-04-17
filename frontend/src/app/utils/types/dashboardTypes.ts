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
import { IconType } from "react-icons";

export interface ManagementSection {
  title?: string;
  name?: string;
  id?: string;
  description?: string;
  icon?: IconType;
  path: string;
  category?: string;
  featured?: boolean;
}

export interface ProtectedRoute {
  path: string;
  roles: string[];
}
