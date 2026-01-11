import { ReactElement } from "react";
import {
  FaMotorcycle,
  FaToolbox,
  FaCaravan,
  FaHelmetSafety,
} from "react-icons/fa6";
import { MdCarRental } from "react-icons/md";

export interface MotorcycleSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export const MotorcyclesForNestedSub: MotorcycleSubCategoryItem[] = [
  {
    so: "Mooto Cusub",
    title: "New Motorcycle",
    icon: <FaMotorcycle size={20} />,
  },
  {
    so: "Mooto La Isticmaalay",
    title: "Used Motorcycle",
    icon: <FaMotorcycle size={20} />,
  },

  { so: "Vespa Cusub", title: "New Vespa", icon: <FaMotorcycle size={20} /> },
  {
    so: "Vespa La Isticmaalay",
    title: "Used Vespa",
    icon: <FaMotorcycle size={20} />,
  },

  { so: "Bajaaj Cusub", title: "New Bajaj", icon: <FaCaravan size={20} /> },
  {
    so: "Bajaaj La Isticmaalay",
    title: "Used Bajaj",
    icon: <FaCaravan size={20} />,
  },

  {
    so: "Mootooyin Ciyaar",
    title: "Sport Bikes",
    icon: <FaMotorcycle size={20} />,
  },
  {
    so: "Mootooyin Xamuul",
    title: "Cargo Bikes",
    icon: <FaMotorcycle size={20} />,
  },
  {
    so: "Bajaaj Xamuul",
    title: "Cargo Bajaj (Tuk Tuk)",
    icon: <FaCaravan size={20} />,
  },
];
export const MotorcycleRentNestedSub: MotorcycleSubCategoryItem[] = [
  {
    so: "Mootooyin Kiro ah",
    title: "Motorcycle Rental",
    icon: <MdCarRental size={20} />,
  },
  {
    so: "Vespa Kiro ah",
    title: "Vespa Rental",
    icon: <MdCarRental size={20} />,
  },
  {
    so: "Mooto Xamuul Kiro ah",
    title: "Cargo Motorcycle Rental",
    icon: <MdCarRental size={20} />,
  },
  {
    so: "Bajaaj Kiro Ah",
    title: "Bajaj for Rent",
    icon: <MdCarRental size={20} />,
  },
  {
    so: "Bajaaj Xamuul Kiro Ah",
    title: "Cargo Bajaj Rental",
    icon: <MdCarRental size={20} />,
  },
  {
    so: "Bajaaj Kiro Maalinle",
    title: "Daily Bajaj Rental",
    icon: <MdCarRental size={20} />,
  },
];

export const MCPartsNestedSub: MotorcycleSubCategoryItem[] = [
  {
    so: "Matoorrada Mootooyinka",
    title: "Motorcycle Engines",
    icon: <FaToolbox size={20} />,
  },
  {
    so: "Taayirrada Mootooyinka",
    title: "Tires/Rims",
    icon: <FaToolbox size={20} />,
  },
  {
    so: "Qalabka Ilaalinta",
    title: "Protective Gear",
    icon: <FaHelmetSafety size={20} />,
  },

  {
    so: "Matoorrada Bajaaj",
    title: "Bajaj Engines",
    icon: <FaToolbox size={20} />,
  },
  {
    so: "Qaybo Jidhka Bajaaj",
    title: "Bajaj Body Parts",
    icon: <FaToolbox size={20} />,
  },
];

export const OtherNestedSub: MotorcycleSubCategoryItem[] = [
  {
    so: "Qalabka kale",
    title: "Miscellaneous Equipment",
    icon: <FaToolbox size={20} />,
  },
];
