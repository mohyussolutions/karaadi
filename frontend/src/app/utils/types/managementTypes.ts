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

export interface NavLink {
  name: string;
  icon: IconType;
  href: string;
  category?: string;
  action?: string;
  labelKey?: string;
}
