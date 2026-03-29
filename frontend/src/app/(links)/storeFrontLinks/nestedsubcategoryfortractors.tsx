import { ReactElement } from "react";
import { GiFarmTractor, GiFertilizerBag, GiGrain } from "react-icons/gi";
import { FaTools, FaTruckMoving } from "react-icons/fa";

export interface TraktorSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
  labelKey?: string;
}

export interface CategoryOption {
  so: string;
  title: string;
  icon: ReactElement;
  labelKey?: string;
}

export const TraktorTopCategories: CategoryOption[] = [
  {
    so: "Cagaf cagaf beec ah",
    title: "Tractor for Sale",
    labelKey: "subcategories.traktorNested.top.tractorForSale",
    icon: <GiFarmTractor size={32} />,
  },
  {
    so: "Qalabka Beeraha",
    title: "Farm Tools",
    labelKey: "subcategories.traktorNested.top.farmTools",
    icon: <FaTruckMoving size={32} />,
  },
  {
    so: "Faafiyaha bacriminta",
    title: "Fertilizer Spreader",
    labelKey: "subcategories.traktorNested.top.fertilizerSpreader",
    icon: <GiFertilizerBag size={32} />,
  },
  {
    so: "Makiinada goosashada badarka",
    title: "Grain Harvester",
    labelKey: "subcategories.traktorNested.top.grainHarvester",
    icon: <GiGrain size={32} />,
  },
];

export const TractorForSaleNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Cagaf cagaf cusub",
    title: "New Tractor",
    labelKey: "subcategories.traktorNested.tractorForSale.newTractor",
    icon: <GiFarmTractor size={20} />,
  },
  {
    so: "Cagaf cagaf la isticmaalay",
    title: "Used Tractor",
    labelKey: "subcategories.traktorNested.tractorForSale.usedTractor",
    icon: <GiFarmTractor size={20} />,
  },
];

export const FarmToolsNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Qalabka wax lagu qoto",
    title: "Plow/Tillage Equipment",
    labelKey: "subcategories.traktorNested.farmTools.plowTillageEquipment",
    icon: <FaTools size={20} />,
  },
  {
    so: "Qalabka abuuritaanka",
    title: "Seeding Equipment",
    labelKey: "subcategories.traktorNested.farmTools.seedingEquipment",
    icon: <FaTools size={20} />,
  },
  {
    so: "Qalabka goosashada",
    title: "Harvesting Equipment",
    labelKey: "subcategories.traktorNested.farmTools.harvestingEquipment",
    icon: <FaTools size={20} />,
  },
];

export const FertilizerSpreaderNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Faafiyaha Mounted",
    title: "Mounted Spreader",
    labelKey: "subcategories.traktorNested.fertilizerSpreader.mountedSpreader",
    icon: <GiFertilizerBag size={20} />,
  },
  {
    so: "Faafiyaha Towed",
    title: "Towed Spreader",
    labelKey: "subcategories.traktorNested.fertilizerSpreader.towedSpreader",
    icon: <GiFertilizerBag size={20} />,
  },
];

export const GrainHarvesterNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Harvester iswada",
    title: "Self-Propelled Harvester",
    labelKey:
      "subcategories.traktorNested.grainHarvester.selfPropelledHarvester",
    icon: <GiGrain size={20} />,
  },
  {
    so: "Harvester jiidan",
    title: "Pull-Type Harvester",
    labelKey: "subcategories.traktorNested.grainHarvester.pullTypeHarvester",
    icon: <GiGrain size={20} />,
  },
];

export const TractorNestedSub: TraktorSubCategoryItem[] = [
  ...TractorForSaleNestedSub,
  ...FarmToolsNestedSub,
  ...FertilizerSpreaderNestedSub,
  ...GrainHarvesterNestedSub,
];
