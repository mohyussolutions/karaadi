import { IconType } from "react-icons";

export type { NavLink } from "./managementTypes";

export interface OptionLink {
  name?: string;
  title?: string;
  icon: IconType;
  href: string;
  description?: string;
  colorClass?: string;
  labelKey?: string;
}
