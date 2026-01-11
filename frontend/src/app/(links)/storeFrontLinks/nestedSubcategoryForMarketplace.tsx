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
}

export const AntiquesAndArtNestedSub: SubCategoryItem[] = [
  {
    so: "Baaquli",
    title: "Bowls",
    icon: <FaUtensils />,
    href: "/Marketplace/antiques-and-art/bowls",
  },
  {
    so: "Qaybo",
    title: "Parts / Pieces",
    icon: <FaStar />,
    href: "/Marketplace/antiques-and-art/parts",
  },
  {
    so: "Adeegga Bunka",
    title: "Coffee Service",
    icon: <FaMugHot />,
    href: "/Marketplace/antiques-and-art/coffee-service",
  },
  {
    so: "Fooraan",
    title: "Porcelain",
    icon: <FaUtensils />,
    href: "/Marketplace/antiques-and-art/general-porcelain",
  },
  {
    so: "Duug ah",
    title: "Vintage",
    icon: <FaPalette />,
    href: "/Marketplace/antiques-and-art/vintage",
  },
  {
    so: "waxkale",
    title: "Other",
    icon: <FaWineGlass />,
    href: "/Marketplace/antiques-and-art/other",
  },
];

// New Marketplace Nested Subcategories
export const ElectronicsNestedSub: SubCategoryItem[] = [
  {
    so: "Telefoonada Gacanta",
    title: "Mobile Phones",
    icon: <FaTv />,
    href: "/Marketplace/electronics/mobile-phones",
  },
  {
    so: "Kumbuyuutarada Gacanta",
    title: "Laptops & Computers",
    icon: <FaLaptop />,
    href: "/Marketplace/electronics/laptops",
  },
  {
    so: "Qalabka TV-yada",
    title: "TVs & Accessories",
    icon: <FaTv />,
    href: "/Marketplace/electronics/tvs",
  },
  {
    so: "Kamaradaha",
    title: "Cameras & Photography",
    icon: <FaCamera />,
    href: "/Marketplace/electronics/cameras",
  },
  {
    so: "Qalabka Guriga",
    title: "Home Appliances",
    icon: <FaTools />,
    href: "/Marketplace/electronics/home-appliances",
  },
  {
    so: "waxkale",
    title: "Other",
    icon: <FaWineGlass />,
    href: "/Marketplace/electronics/other",
  },
];

export const AnimalAndSuppliesNestedSub: SubCategoryItem[] = [
  {
    so: "Xoolo Nool (Riyo, Lo')",
    title: "Livestock (Goats, Cattle)",
    icon: <GiGoat />,
    href: "/Marketplace/animal-and-supplies/livestock",
  },
  {
    so: "Xayawaan Gurijoog ah (Eey, Bisad)",
    title: "Pets (Dogs, Cats)",
    icon: <FaPaw />,
    href: "/Marketplace/animal-and-supplies/pets",
  },
  {
    so: "Quudinta Xoolaha",
    title: "Animal Feed & Hay",
    icon: <GiFertilizerBag />,
    href: "/Marketplace/animal-and-supplies/feed",
  },
  {
    so: "Agabka Xayawaanka",
    title: "Pet Accessories",
    icon: <FaToolbox />,
    href: "/Marketplace/animal-and-supplies/accessories",
  },
  {
    so: "waxkale",
    title: "Other",
    icon: <FaWineGlass />,
    href: "/Marketplace/animal-and-supplies/other",
  },
];

export const SportsAndOutdoorsNestedSub: SubCategoryItem[] = [
  {
    so: "Qalabka Jimicsiga",
    title: "Gym Equipment",
    icon: <FaDumbbell />,
    href: "/Marketplace/sports-and-outdoors/gym-equipment",
  },
  {
    so: "Baaskiilada",
    title: "Bicycles",
    icon: <FaBicycle />,
    href: "/Marketplace/sports-and-outdoors/bicycles",
  },
  {
    so: "Qalabka Ciyaaraha",
    title: "Sporting Goods",
    icon: <FaStar />,
    href: "/Marketplace/sports-and-outdoors/sporting-goods",
  },
  {
    so: "Qalabka Safarka",
    title: "Camping & Hiking Gear",
    icon: <FaShip />,
    href: "/Marketplace/sports-and-outdoors/camping-gear",
  },
  {
    so: "Alaabta & Ciyaaraha Carruurta",
    title: "Toys",
    icon: <FaPuzzlePiece />,
    href: "/Marketplace/sports-and-outdoors/toys",
  },
  {
    so: "waxkale",
    title: "Other",
    icon: <FaWineGlass />,
    href: "/Marketplace/sports-and-outdoors/other",
  },
];

export const FurnitureNestedSub: SubCategoryItem[] = [
  {
    so: "Fadhiyada",
    title: "Sofas & Couches",
    icon: <FaCouch />,
    href: "/Marketplace/furniture/sofas",
  },
  {
    so: "Sariiraha",
    title: "Beds & Mattresses",
    icon: <FaHome />,
    href: "/Marketplace/furniture/beds",
  },
  {
    so: "Miisaska",
    title: "Tables & Desks",
    icon: <FaUtensils />,
    href: "/Marketplace/furniture/tables",
  },
  {
    so: "Qalabka Jikada",
    title: "Kitchen Furnishings",
    icon: <FaMugHot />,
    href: "/Marketplace/furniture/kitchen",
  },
  {
    so: "waxkale",
    title: "Other",
    icon: <FaWineGlass />,
    href: "/Marketplace/furniture/other",
  },
];

export const FashionNestedSub: SubCategoryItem[] = [
  {
    so: "Dharka Ragga",
    title: "Men's Clothing",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion/mens-clothing",
  },
  {
    so: "Dharka Haweenka",
    title: "Women's Clothing",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion/womens-clothing",
  },
  {
    so: "Kabaha",
    title: "Shoes & Footwear",
    icon: <FaStar />,
    href: "/Marketplace/fashion/shoes",
  },
  {
    so: "Boorsooyinka",
    title: "Bags & Wallets",
    icon: <GiBriefcase />,
    href: "/Marketplace/fashion/bags",
  },
  {
    so: "waxkale",
    title: "Other",
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
