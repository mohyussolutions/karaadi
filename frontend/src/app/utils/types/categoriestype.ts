import { IconType } from "react-icons";
import { JSX, ReactNode } from "react";

export interface CategoryOption {
  so?: string;
  title: string;
  description?: string;
  icon?: JSX.Element;
  href?: string;
}

export interface MainCategory {
  title: ReactNode;
  key?: string;
  name?: string | undefined;
  href: string;
  icon: JSX.Element;
  so?: string;
  dashboardIcon: IconType;
  dashboardLink: string;
  logo?: string;
  subCategories: CategoryOption[];
}

export interface AdminLink {
  title: string;
  href: string;
}

export interface SidebarLink {
  name: string;
  icon: IconType;
  link: string;
}

export type CategoryList = string[];

export interface SettingLink {
  title: string;
  items: string[];
  actionButton?: {
    text: string;
    type?: "visitors";
    href?: string;
  };
}
export interface SubCategory {
  key: string;
  title: string;
  href: string;
  so: string;
}
