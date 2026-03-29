import { ReactElement } from "react";
import {
  FaTools,
  FaToolbox,
  FaShip,
  FaHome,
  FaLaptop,
  FaTv,
  FaUtensils,
  FaMugHot,
  FaWineGlass,
  FaPalette,
  FaStar,
  FaBicycle,
  FaCouch,
  FaTshirt,
  FaCamera,
  FaPaw,
  FaDumbbell,
  FaPuzzlePiece,
} from "react-icons/fa";
import { GiFertilizerBag, GiBriefcase, GiGoat } from "react-icons/gi";
import { FaTruckFront } from "react-icons/fa6";

interface SubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
  href: string;
  labelKey?: string;
}

export const AntiquesAndArtNestedSub: SubCategoryItem[] = [
  {
    so: "Baaquli",
    title: "Bowls",
    labelKey: "subcategories.marketplaceNested.antiques.bowls",
    icon: <FaUtensils />,
    href: "/Marketplace/antiques-and-art/bowls",
  },
  {
    so: "Qaybo",
    title: "Parts / Pieces",
    labelKey: "subcategories.marketplaceNested.antiques.parts",
    icon: <FaStar />,
    href: "/Marketplace/antiques-and-art/parts",
  },
  {
    so: "Adeegga Bunka",
    title: "Coffee Service",
    labelKey: "subcategories.marketplaceNested.antiques.coffeeService",
    icon: <FaMugHot />,
    href: "/Marketplace/antiques-and-art/coffee-service",
  },
  {
    so: "Fooraan",
    title: "Porcelain",
    labelKey: "subcategories.marketplaceNested.antiques.porcelain",
    icon: <FaUtensils />,
    href: "/Marketplace/antiques-and-art/general-porcelain",
  },
  {
    so: "Duug ah",
    title: "Vintage",
    labelKey: "subcategories.marketplaceNested.antiques.vintage",
    icon: <FaPalette />,
    href: "/Marketplace/antiques-and-art/vintage",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.antiques.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/antiques-and-art/other",
  },
];

export const ElectronicsNestedSub: SubCategoryItem[] = [
  {
    so: "Telefoonada Gacanta",
    title: "Mobile Phones",
    labelKey: "subcategories.marketplaceNested.electronics.mobilePhones",
    icon: <FaTv />,
    href: "/Marketplace/electronics/mobile-phones",
  },
  {
    so: "Kumbuyuutarada Gacanta",
    title: "Laptops & Computers",
    labelKey: "subcategories.marketplaceNested.electronics.laptopsComputers",
    icon: <FaLaptop />,
    href: "/Marketplace/electronics/laptops",
  },
  {
    so: "Qalabka TV-yada",
    title: "TVs & Accessories",
    labelKey: "subcategories.marketplaceNested.electronics.tvsAccessories",
    icon: <FaTv />,
    href: "/Marketplace/electronics/tvs",
  },
  {
    so: "Kamaradaha",
    title: "Cameras & Photography",
    labelKey: "subcategories.marketplaceNested.electronics.camerasPhotography",
    icon: <FaCamera />,
    href: "/Marketplace/electronics/cameras",
  },
  {
    so: "Qalabka Guriga",
    title: "Home Appliances",
    labelKey: "subcategories.marketplaceNested.electronics.homeAppliances",
    icon: <FaTools />,
    href: "/Marketplace/electronics/home-appliances",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.electronics.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/electronics/other",
  },
];

export const AnimalAndSuppliesNestedSub: SubCategoryItem[] = [
  {
    so: "Xoolo Nool (Riyo, Lo')",
    title: "Livestock (Goats, Cattle)",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.livestock",
    icon: <GiGoat />,
    href: "/Marketplace/animal-and-supplies/livestock",
  },
  {
    so: "Xayawaan Gurijoog ah (Eey, Bisad)",
    title: "Pets (Dogs, Cats)",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.pets",
    icon: <FaPaw />,
    href: "/Marketplace/animal-and-supplies/pets",
  },
  {
    so: "Quudinta Xoolaha",
    title: "Animal Feed & Hay",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.feed",
    icon: <GiFertilizerBag />,
    href: "/Marketplace/animal-and-supplies/feed",
  },
  {
    so: "Agabka Xayawaanka",
    title: "Pet Accessories",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.accessories",
    icon: <FaToolbox />,
    href: "/Marketplace/animal-and-supplies/accessories",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/animal-and-supplies/other",
  },
];

export const SportsAndOutdoorsNestedSub: SubCategoryItem[] = [
  {
    so: "Qalabka Jimicsiga",
    title: "Gym Equipment",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.gymEquipment",
    icon: <FaDumbbell />,
    href: "/Marketplace/sports-and-outdoors/gym-equipment",
  },
  {
    so: "Baaskiilada",
    title: "Bicycles",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.bicycles",
    icon: <FaBicycle />,
    href: "/Marketplace/sports-and-outdoors/bicycles",
  },
  {
    so: "Qalabka Ciyaaraha",
    title: "Sporting Goods",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.sportingGoods",
    icon: <FaStar />,
    href: "/Marketplace/sports-and-outdoors/sporting-goods",
  },
  {
    so: "Qalabka Safarka",
    title: "Camping & Hiking Gear",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.campingGear",
    icon: <FaShip />,
    href: "/Marketplace/sports-and-outdoors/camping-gear",
  },
  {
    so: "Alaabta & Ciyaaraha Carruurta",
    title: "Toys",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.toys",
    icon: <FaPuzzlePiece />,
    href: "/Marketplace/sports-and-outdoors/toys",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/sports-and-outdoors/other",
  },
];

export const FurnitureNestedSub: SubCategoryItem[] = [
  {
    so: "Fadhiyada",
    title: "Sofas & Couches",
    labelKey: "subcategories.marketplaceNested.furniture.sofasCouches",
    icon: <FaCouch />,
    href: "/Marketplace/furniture/sofas",
  },
  {
    so: "Sariiraha",
    title: "Beds & Mattresses",
    labelKey: "subcategories.marketplaceNested.furniture.bedsMattresses",
    icon: <FaHome />,
    href: "/Marketplace/furniture/beds",
  },
  {
    so: "Miisaska",
    title: "Tables & Desks",
    labelKey: "subcategories.marketplaceNested.furniture.tablesDesks",
    icon: <FaUtensils />,
    href: "/Marketplace/furniture/tables",
  },
  {
    so: "Qalabka Jikada",
    title: "Kitchen Furnishings",
    labelKey: "subcategories.marketplaceNested.furniture.kitchenFurnishings",
    icon: <FaMugHot />,
    href: "/Marketplace/furniture/kitchen",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.furniture.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/furniture/other",
  },
];

export const FashionNestedSub: SubCategoryItem[] = [
  {
    so: "Dharka Ragga",
    title: "Men's Clothing",
    labelKey: "subcategories.marketplaceNested.fashion.mensClothing",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion/mens-clothing",
  },
  {
    so: "Dharka Haweenka",
    title: "Women's Clothing",
    labelKey: "subcategories.marketplaceNested.fashion.womensClothing",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion/womens-clothing",
  },
  {
    so: "Kabaha",
    title: "Shoes & Footwear",
    labelKey: "subcategories.marketplaceNested.fashion.shoesFootwear",
    icon: <FaStar />,
    href: "/Marketplace/fashion/shoes",
  },
  {
    so: "Boorsooyinka",
    title: "Bags & Wallets",
    labelKey: "subcategories.marketplaceNested.fashion.bagsWallets",
    icon: <GiBriefcase />,
    href: "/Marketplace/fashion/bags",
  },
  {
    so: "waxkale",
    title: "Other",
    labelKey: "subcategories.marketplaceNested.fashion.other",
    icon: <FaWineGlass />,
    href: "/Marketplace/fashion/other",
  },
];

export const realEstateNestedSubCategories: SubCategoryItem[] = [];
export const carsNestedSubCategories: SubCategoryItem[] = [];
export const motorcyclesNestedSubCategories: SubCategoryItem[] = [];
export const boatsNestedSubCategories: SubCategoryItem[] = [];
export const tractorsNestedSubCategories: SubCategoryItem[] = [];
export const jobsNestedSubCategories: SubCategoryItem[] = [];
