import { ReactElement } from "react";
import { User } from "@/app/utils/types/user";

export interface NavItem {
  label: string;
  href: string;
  icon: ReactElement;
}

export interface NavItemsProps {
  user: User | null;
}
