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
  key: string;
  so: string;
  title: string;
  icon: ReactElement;
}

export const BoatsForSaleNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishing-boat",
    so: "Doon kalluumaysi",
    title: "Fishing Boat",
    icon: <GiFishingBoat />,
  },
  {
    key: "leisure-yacht",
    so: "Doon raaxo",
    title: "Leisure Yacht",
    icon: <FaShip />,
  },
  {
    key: "sailboat",
    so: "Doon shiraac",
    title: "Sailboat",
    icon: <GiSailboat />,
  },
  {
    key: "speedboat",
    so: "Doon yar oo xawaare leh",
    title: "Speedboat",
    icon: <IoBoatSharp />,
  },
];

export const BoatsForRentNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishing-boat-rental",
    so: "Kiree Doon kalluumaysi",
    title: "Fishing Boat Rental",
    icon: <GiBoatFishing />,
  },
  {
    key: "yacht-charter",
    so: "Kiree Doon raaxo",
    title: "Yacht Charter",
    icon: <FaShip />,
  },
];

export const BoatEnginesNestedSub: BoatSubCategoryItem[] = [
  {
    key: "outboard-engine",
    so: "Matoor dibadda ah (Outboard)",
    title: "Outboard Engine",
    icon: <GiBoatPropeller />,
  },
  {
    key: "inboard-engine",
    so: "Matoor gudaha ah (Inboard)",
    title: "Inboard Engine",
    icon: <FaWrench />,
  },
  {
    key: "used-engine",
    so: "Matoor la isticmaalay",
    title: "Used Engine",
    icon: <FaTools />,
  },
];

export const BoatPartsNestedSub: BoatSubCategoryItem[] = [
  {
    key: "engine-parts",
    so: "Qaybaha Mashiinka",
    title: "Engine Parts",
    icon: <FaWrench />,
  },
  {
    key: "navigation-equipment",
    so: "Qalabka Navigashanka",
    title: "Navigation Equipment",
    icon: <FaShip />,
  },
  {
    key: "safety-gear",
    so: "Qalabka Badbaadada",
    title: "Safety Gear",
    icon: <GiBoatFishing />,
  },
];
