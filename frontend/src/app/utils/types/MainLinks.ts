import { IconType } from "react-icons";

export interface NavLink {
  name: string;
  icon: IconType;
  href: string;
  category?: string;
  action?: string;
  labelKey?: string;
}

export interface OptionLink {
  name?: string;
  title?: string;
  icon: IconType;
  href: string;
  description?: string;
  colorClass?: string;
  labelKey?: string;
}
