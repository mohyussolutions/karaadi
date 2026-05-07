import {
  FaHome,
  FaCar,
  FaMotorcycle,
  FaShip,
  FaTractor,
  FaStore,
} from "react-icons/fa";

export type CategoryKey =
  | "realestate"
  | "motor"
  | "motorcycles"
  | "boats"
  | "farmequipment"
  | "marketplace"
  | "schools";

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  icon: React.ElementType;
}

export const BUSINESS_CATEGORIES: CategoryConfig[] = [
  { key: "realestate",    label: "Real Estate",    icon: FaHome },
  { key: "motor",         label: "Cars",           icon: FaCar },
  { key: "motorcycles",   label: "Motorcycles",    icon: FaMotorcycle },
  { key: "boats",         label: "Boats",          icon: FaShip },
  { key: "farmequipment", label: "Farm Equipment", icon: FaTractor },
  { key: "marketplace",   label: "Marketplace",    icon: FaStore },
];
