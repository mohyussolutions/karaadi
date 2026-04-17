export type { CategoryOption } from "./nesSubCategoryTypes";
import { IconType } from "react-icons";
export interface SidebarLink {
  name: string;
  icon: IconType;
  link: string;
}
export interface SettingLink {
  title: string;
  items: string[];
  actionButton?: {
    text: string;
    type?: "visitors";
    href?: string;
  };
}
import { ReactNode } from "react";

export interface MainCategory {
  key: string;
  name?: string;
  logo?: string;
  href: string;
  icon: ReactNode;
  so?: string;
  dashboardIcon?: import("react-icons").IconType;
  dashboardLink?: string;
  subCategories: any[];
  title?: string;
  labelKey?: string;
}
