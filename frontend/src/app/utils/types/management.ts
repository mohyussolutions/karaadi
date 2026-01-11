// app/(dashboard)/dashboard/managment/types/management.ts
import { IconType } from "react-icons";

export type UserRole = "admin" | "manager" | "support";

export interface ManagementLink {
  name: string;
  icon: IconType;
  link: string;
  description?: string;
  category?: "content" | "analytics" | "settings" | "operations" | "setup";
  role: UserRole[];
  featured?: boolean;
}

export interface PreLaunchFeature {
  name: string;
  icon: IconType;
  link: string;
  description: string;
  category: "setup" | "content" | "promotion" | "configuration";
  role: UserRole[];
  enabled: boolean;
  priority: "high" | "medium" | "low";
}
