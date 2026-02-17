import { ReactElement } from "react";
import { GiFarmTractor, GiFertilizerBag, GiGrain } from "react-icons/gi";
import { FaTools, FaTruckMoving } from "react-icons/fa";

export interface TraktorSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export interface CategoryOption {
  so: string;
  title: string;
  icon: ReactElement;
}

export const TraktorTopCategories: CategoryOption[] = [
  {
    so: "Cagaf cagaf beec ah",
    title: "Tractor for Sale",
    icon: <GiFarmTractor size={32} />,
  },
  {
    so: "Qalabka Beeraha",
    title: "Farm Tools",
    icon: <FaTruckMoving size={32} />,
  },
  {
    so: "Faafiyaha bacriminta",
    title: "Fertilizer Spreader",
    icon: <GiFertilizerBag size={32} />,
  },
  {
    so: "Makiinada goosashada badarka",
    title: "Grain Harvester",
    icon: <GiGrain size={32} />,
  },
];

export const TractorForSaleNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Cagaf cagaf cusub",
    title: "New Tractor",
    icon: <GiFarmTractor size={20} />,
  },
  {
    so: "Cagaf cagaf la isticmaalay",
    title: "Used Tractor",
    icon: <GiFarmTractor size={20} />,
  },
];

export const FarmToolsNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Qalabka wax lagu qoto",
    title: "Plow/Tillage Equipment",
    icon: <FaTools size={20} />,
  },
  {
    so: "Qalabka abuuritaanka",
    title: "Seeding Equipment",
    icon: <FaTools size={20} />,
  },
  {
    so: "Qalabka goosashada",
    title: "Harvesting Equipment",
    icon: <FaTools size={20} />,
  },
];

export const FertilizerSpreaderNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Faafiyaha Mounted",
    title: "Mounted Spreader",
    icon: <GiFertilizerBag size={20} />,
  },
  {
    so: "Faafiyaha Towed",
    title: "Towed Spreader",
    icon: <GiFertilizerBag size={20} />,
  },
];

export const GrainHarvesterNestedSub: TraktorSubCategoryItem[] = [
  {
    so: "Harvester iswada",
    title: "Self-Propelled Harvester",
    icon: <GiGrain size={20} />,
  },
  {
    so: "Harvester jiidan",
    title: "Pull-Type Harvester",
    icon: <GiGrain size={20} />,
  },
];

export const TractorNestedSub: TraktorSubCategoryItem[] = [
  ...TractorForSaleNestedSub,
  ...FarmToolsNestedSub,
  ...FertilizerSpreaderNestedSub,
  ...GrainHarvesterNestedSub,
];
