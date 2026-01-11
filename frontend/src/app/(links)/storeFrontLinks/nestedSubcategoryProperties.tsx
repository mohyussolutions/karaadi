import { ReactElement } from "react";
import {
  FaHome,
  FaDollarSign,
  FaBuilding,
  FaStore,
  FaWarehouse,
  FaTruckMoving,
  FaTree,
} from "react-icons/fa";
import { GiField, GiFarmer, GiBrickWall } from "react-icons/gi";

interface SubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export const RealEstateForRentNestedSub: SubCategoryItem[] = [
  {
    so: "Guri dabaq ah",
    title: "Apartment/Flat",
    icon: <FaBuilding />,
  },
  {
    so: "Guri gooni ah",
    title: "House/Villa",
    icon: <FaHome />,
  },
  {
    so: "Xafiis Ganacsi",
    title: "Commercial Office",
    icon: <FaStore />,
  },
  {
    so: "Bakhaar/Keyd",
    title: "Warehouse/Storage",
    icon: <FaWarehouse />,
  },
  {
    so: "Qol keli ah",
    title: "Single Room",
    icon: <FaHome />,
  },
];

export const RealEstateForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Guri cusub",
    title: "New House/Villa",
    icon: <FaHome />,
  },
  {
    so: "Guri la isticmaalay",
    title: "Used House/Villa",
    icon: <FaHome />,
  },
  {
    so: "Guri dabaq iib ah",
    title: "Apartment/Flat for Sale",
    icon: <FaBuilding />,
  },
  {
    so: "Dhismaha la Dhameystiray",
    title: "Completed Building",
    icon: <FaBuilding />,
  },
];

export const RealEstateLandForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Dhul Degganaan",
    title: "Residential Land",
    icon: <GiBrickWall />,
  },
  {
    so: "Dhul Ganacsi",
    title: "Commercial Land",
    icon: <FaStore />,
  },
  {
    so: "Dhul Warshadeed",
    title: "Industrial Land",
    icon: <FaTruckMoving />,
  },
];

export const RealEstateFarmForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Dhul Beereed",
    title: "Agricultural Land",
    icon: <GiField />,
  },
  {
    so: "Beerta Xoolaha",
    title: "Livestock Farm",
    icon: <GiFarmer />,
  },
  {
    so: "Beeraha Geedaha",
    title: "Tree/Forest Farms",
    icon: <FaTree />,
  },
];

export const RealEstateCommercialNestedSub: SubCategoryItem[] = [
  {
    so: "Goob tafaariiq",
    title: "Retail Space/Shop",
    icon: <FaStore />,
  },
  {
    so: "Huteel/Martiqaad",
    title: "Hotel/Guesthouse",
    icon: <FaBuilding />,
  },
  {
    so: "Dhismaha Ganacsiga",
    title: "Commercial Building",
    icon: <FaBuilding />,
  },
  {
    so: "Bakhaar weyn",
    title: "Large Warehouse",
    icon: <FaWarehouse />,
  },
];
