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
  labelKey?: string;
  icon: ReactElement;
}

export const BoatsForSaleNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishing-boat",
    so: "Doon kalluumaysi",
    title: "Fishing Boat",
    labelKey: "subcategories.boatsNested.boatsForSale.fishingBoat",
    icon: <GiFishingBoat />,
  },
  {
    key: "leisure-yacht",
    so: "Doon raaxo",
    title: "Leisure Yacht",
    labelKey: "subcategories.boatsNested.boatsForSale.leisureYacht",
    icon: <FaShip />,
  },
  {
    key: "sailboat",
    so: "Doon shiraac",
    title: "Sailboat",
    labelKey: "subcategories.boatsNested.boatsForSale.sailboat",
    icon: <GiSailboat />,
  },
  {
    key: "speedboat",
    so: "Doon yar oo xawaare leh",
    title: "Speedboat",
    labelKey: "subcategories.boatsNested.boatsForSale.speedboat",
    icon: <IoBoatSharp />,
  },
];

export const BoatsForRentNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishing-boat-rental",
    so: "Kiree Doon kalluumaysi",
    title: "Fishing Boat Rental",
    labelKey: "subcategories.boatsNested.boatsForRent.fishingBoatRental",
    icon: <GiBoatFishing />,
  },
  {
    key: "yacht-charter",
    so: "Kiree Doon raaxo",
    title: "Yacht Charter",
    labelKey: "subcategories.boatsNested.boatsForRent.yachtCharter",
    icon: <FaShip />,
  },
];

export const BoatEnginesNestedSub: BoatSubCategoryItem[] = [
  {
    key: "outboard-engine",
    so: "Matoor dibadda ah (Outboard)",
    title: "Outboard Engine",
    labelKey: "subcategories.boatsNested.engines.outboardEngine",
    icon: <GiBoatPropeller />,
  },
  {
    key: "inboard-engine",
    so: "Matoor gudaha ah (Inboard)",
    title: "Inboard Engine",
    labelKey: "subcategories.boatsNested.engines.inboardEngine",
    icon: <FaWrench />,
  },
  {
    key: "used-engine",
    so: "Matoor la isticmaalay",
    title: "Used Engine",
    labelKey: "subcategories.boatsNested.engines.usedEngine",
    icon: <FaTools />,
  },
];

export const BoatPartsNestedSub: BoatSubCategoryItem[] = [
  {
    key: "engine-parts",
    so: "Qaybaha Mashiinka",
    title: "Engine Parts",
    labelKey: "subcategories.boatsNested.parts.engineParts",
    icon: <FaWrench />,
  },
  {
    key: "navigation-equipment",
    so: "Qalabka Navigashanka",
    title: "Navigation Equipment",
    labelKey: "subcategories.boatsNested.parts.navigationEquipment",
    icon: <FaShip />,
  },
  {
    key: "safety-gear",
    so: "Qalabka Badbaadada",
    title: "Safety Gear",
    labelKey: "subcategories.boatsNested.parts.safetyGear",
    icon: <GiBoatFishing />,
  },
];
