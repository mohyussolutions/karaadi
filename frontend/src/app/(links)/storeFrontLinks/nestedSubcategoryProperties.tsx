import { ReactElement } from "react";
import {
  FaHome,
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
  labelKey?: string;
}

export const RealEstateForRentNestedSub: SubCategoryItem[] = [
  {
    so: "Guri dabaq ah",
    title: "Apartment/Flat",
    labelKey: "subcategories.realEstateNested.forRent.apartmentFlat",
    icon: <FaBuilding />,
  },
  {
    so: "Guri gooni ah",
    title: "House/Villa",
    labelKey: "subcategories.realEstateNested.forRent.houseVilla",
    icon: <FaHome />,
  },
  {
    so: "Xafiis Ganacsi",
    title: "Commercial Office",
    labelKey: "subcategories.realEstateNested.forRent.commercialOffice",
    icon: <FaStore />,
  },
  {
    so: "Bakhaar/Keyd",
    title: "Warehouse/Storage",
    labelKey: "subcategories.realEstateNested.forRent.warehouseStorage",
    icon: <FaWarehouse />,
  },
  {
    so: "Qol keli ah",
    title: "Single Room",
    labelKey: "subcategories.realEstateNested.forRent.singleRoom",
    icon: <FaHome />,
  },
];

export const RealEstateForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Guri cusub",
    title: "New House/Villa",
    labelKey: "subcategories.realEstateNested.forSale.newHouseVilla",
    icon: <FaHome />,
  },
  {
    so: "Guri la isticmaalay",
    title: "Used House/Villa",
    labelKey: "subcategories.realEstateNested.forSale.usedHouseVilla",
    icon: <FaHome />,
  },
  {
    so: "Guri dabaq iib ah",
    title: "Apartment/Flat for Sale",
    labelKey: "subcategories.realEstateNested.forSale.apartmentFlatForSale",
    icon: <FaBuilding />,
  },
  {
    so: "Dhismaha la Dhameystiray",
    title: "Completed Building",
    labelKey: "subcategories.realEstateNested.forSale.completedBuilding",
    icon: <FaBuilding />,
  },
];

export const RealEstateLandForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Dhul Degganaan",
    title: "Residential Land",
    labelKey: "subcategories.realEstateNested.landForSale.residentialLand",
    icon: <GiBrickWall />,
  },
  {
    so: "Dhul Ganacsi",
    title: "Commercial Land",
    labelKey: "subcategories.realEstateNested.landForSale.commercialLand",
    icon: <FaStore />,
  },
  {
    so: "Dhul Warshadeed",
    title: "Industrial Land",
    labelKey: "subcategories.realEstateNested.landForSale.industrialLand",
    icon: <FaTruckMoving />,
  },
];

export const RealEstateFarmForSaleNestedSub: SubCategoryItem[] = [
  {
    so: "Dhul Beereed",
    title: "Agricultural Land",
    labelKey: "subcategories.realEstateNested.farmForSale.agriculturalLand",
    icon: <GiField />,
  },
  {
    so: "Beerta Xoolaha",
    title: "Livestock Farm",
    labelKey: "subcategories.realEstateNested.farmForSale.livestockFarm",
    icon: <GiFarmer />,
  },
  {
    so: "Beeraha Geedaha",
    title: "Tree/Forest Farms",
    labelKey: "subcategories.realEstateNested.farmForSale.treeForestFarms",
    icon: <FaTree />,
  },
];

export const RealEstateCommercialNestedSub: SubCategoryItem[] = [
  {
    so: "Goob tafaariiq",
    title: "Retail Space/Shop",
    labelKey: "subcategories.realEstateNested.commercial.retailSpaceShop",
    icon: <FaStore />,
  },
  {
    so: "Huteel/Martiqaad",
    title: "Hotel/Guesthouse",
    labelKey: "subcategories.realEstateNested.commercial.hotelGuesthouse",
    icon: <FaBuilding />,
  },
  {
    so: "Dhismaha Ganacsiga",
    title: "Commercial Building",
    labelKey: "subcategories.realEstateNested.commercial.commercialBuilding",
    icon: <FaBuilding />,
  },
  {
    so: "Bakhaar weyn",
    title: "Large Warehouse",
    labelKey: "subcategories.realEstateNested.commercial.largeWarehouse",
    icon: <FaWarehouse />,
  },
];

export const categoryNestedMap: Record<string, SubCategoryItem[]> = {
  "For Rent": RealEstateForRentNestedSub,
  "For Sale": RealEstateForSaleNestedSub,
  "Land for Sale": RealEstateLandForSaleNestedSub,
  "Farm for Sale": RealEstateFarmForSaleNestedSub,
  Commercial: RealEstateCommercialNestedSub,
};
