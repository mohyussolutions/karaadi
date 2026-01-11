import { ReactElement } from "react";
import { FaShip, FaTools, FaWrench } from "react-icons/fa";
import {
  GiBoatFishing,
  GiBoatPropeller,
  GiFishingBoat,
  GiSailboat,
} from "react-icons/gi";
import { IoBoatSharp } from "react-icons/io5";

export interface BoatSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export const BoatsForSaleNestedSub: BoatSubCategoryItem[] = [
  {
    so: "Doon kalluumaysi",
    title: "Fishing Boat",
    icon: <GiFishingBoat />,
  },
  {
    so: "Doon raaxo",
    title: "Leisure Yacht",
    icon: <FaShip />,
  },
  {
    so: "Doon shiraac",
    title: "Sailboat",
    icon: <GiSailboat />,
  },
  {
    so: "Doon yar oo xawaare leh",
    title: "Speedboat",
    icon: <IoBoatSharp />,
  },
];

export const BoatsForRentNestedSub: BoatSubCategoryItem[] = [
  {
    so: "Kiree Doon kalluumaysi",
    title: "Fishing Boat Rental",
    icon: <GiBoatFishing />,
  },
  {
    so: "Kiree Doon raaxo",
    title: "Yacht Charter",
    icon: <FaShip />,
  },
];

export const BoatEnginesForSaleNestedSub: BoatSubCategoryItem[] = [
  {
    so: "Matoor dibadda ah (Outboard)",
    title: "Outboard Engine",
    icon: <GiBoatPropeller />,
  },
  {
    so: "Matoor gudaha ah (Inboard)",
    title: "Inboard Engine",
    icon: <FaWrench />,
  },
  {
    so: "Matoor la isticmaalay",
    title: "Used Engine",
    icon: <FaTools />,
  },
];

export const BoatPartsNestedSub: BoatSubCategoryItem[] = [
  {
    so: "Qaybaha Mashiinka",
    title: "Engine Parts",
    icon: <FaWrench />,
  },
  {
    so: "Qalabka Navigashanka",
    title: "Navigation Equipment",
    icon: <FaShip />,
  },
  {
    so: "Qalabka Badbaadada",
    title: "Safety Gear",
    icon: <GiBoatFishing />,
  },
];
