import {
  FaCarSide,
  FaCar,
  FaTrailer,
  FaTools,
  FaMotorcycle,
  FaToolbox,
  FaShip,
  FaCouch,
  FaTshirt,
  FaTv,
  FaPaintBrush,
  FaBicycle,
  FaTruckMoving,
  FaHome,
  FaDollarSign,
} from "react-icons/fa";
import {
  GiGoat,
  GiBoatFishing,
  GiBoatPropeller,
  GiFarmer,
  GiFarmTractor,
  GiFertilizerBag,
  GiField,
  GiGrain,
} from "react-icons/gi";
import { FaBus, FaTruckFront } from "react-icons/fa6";
import { ReactElement } from "react";
import {
  MdCarRental,
  MdElectricCar,
  MdOutlineMiscellaneousServices,
  MdSportsSoccer,
} from "react-icons/md";
import { CategoryOption, SubCategory } from "@/app/utils/types/categoriestype";

export interface TraktorSubCategoryItem {
  so: string;
  title: string;
  icon: ReactElement;
}

export const marketplaceSubCategories: CategoryOption[] = [
  {
    so: "Alaabta qadiimiga & farshaxanka",
    title: "Antiques & Art",
    icon: <FaPaintBrush />,
    href: "/Marketplace/antiques-and-art",
  },
  {
    so: "Telefoon, TV iyo qalab guri",
    title: "Electronics",
    icon: <FaTv />,
    href: "/Marketplace/electronics",
  },
  {
    so: "Xayawaan iyo agabka",
    title: "Animal & Supplies",
    icon: <GiGoat />,
    href: "/Marketplace/animalAndSupplies-and-supplies",
  },
  {
    so: "Qalabka ciyaaraha & dibadda",
    title: "Sports & Outdoors",
    icon: <MdSportsSoccer />,
    href: "/Marketplace/sports-and-outdoors",
  },
  {
    so: "Alaabta guriga & qurxinta",
    title: "Furniture",
    icon: <FaCouch />,
    href: "/Marketplace/furniture-and-interior",
  },
  {
    so: "Dharka, boorsooyinka & waxyaabo kale",
    title: "Fashion",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion-and-accessories",
  },
];

export const realEstateSubCategories: CategoryOption[] = [
  {
    so: "Kirada",
    title: "For Rent",
    icon: <FaHome size={32} />,
  },
  {
    so: "Iib",
    title: "For Sale",
    icon: <FaDollarSign size={32} />,
  },
  {
    so: "Dhul iib ah",
    title: "Land for Sale",
    icon: <GiField size={32} />,
  },
  {
    so: "Beer iib ah",
    title: "Farm for Sale",
    icon: <GiFarmer size={32} />,
  },
  {
    so: "Ganacsi",
    title: "Commercial",
    icon: <GiFarmer size={32} />,
  },
];

export const carsSubCategories: CategoryOption[] = [
  {
    so: "Gawaari iib ah",
    title: "Cars for Sale",
    icon: <FaCarSide size={28} />,
  },
  { so: "Gawaari kirayn", title: "Lease Cars", icon: <FaCar size={28} /> },
  { so: "rimoor", title: "Trailers", icon: <FaTrailer size={28} /> },
  { so: "Qaybaha gawaarida", title: "Car Parts", icon: <FaTools size={28} /> },
  { so: "Baabuur xamuul", title: "Truck", icon: <FaTruckFront size={28} /> },
  {
    so: "Gawaari Koronto",
    title: "Electric Cars",
    icon: <MdElectricCar size={28} />,
  },
  {
    so: "Basas",
    title: "Buses",
    icon: <FaBus size={28} />,
  },
];

export const motorcyclesSubCategories: CategoryOption[] = [
  {
    so: "Beec ah",
    title: "for Sale",
    icon: <FaMotorcycle size={32} />,
  },
  {
    so: "Kiro ah",
    title: "for Rent",
    icon: <MdCarRental size={32} />,
  },
  {
    so: "Qaybaha",
    title: "Spare Parts",
    icon: <MdOutlineMiscellaneousServices size={32} />,
  },
  {
    so: "Wax Kale",
    title: "Other",
    icon: <FaToolbox size={32} />,
  },
];

export const boatsSubCategories: CategoryOption[] = [
  { so: "Doomo iib ah", title: "Boats for Sale", icon: <FaShip size={28} /> },
  {
    so: "Doomo kireysi ah",
    title: "Boats for Rent",
    icon: <GiBoatFishing size={28} />,
  },
  {
    so: "Matoorada doomo iib ah",
    title: "Boat Engines for Sale",
    icon: <GiBoatPropeller size={28} />,
  },
  { so: "Qaybaha doomo", title: "Boat Parts", icon: <FaTools size={28} /> },
];

export const traktorSubCategories: TraktorSubCategoryItem[] = [
  {
    so: "Cagaf cagaf beec ah",
    title: "Tractor for Sale",
    icon: <GiFarmTractor size={32} />,
  },
  {
    so: "qalabka beeraha",
    title: "Farm Tools",
    icon: <FaTruckMoving size={32} />,
  },
  {
    so: "Faafiyaha bacriminta.",
    title: "Fertilizer Spreader",
    icon: <GiFertilizerBag size={32} />,
  },
  {
    so: "Makiinada goosashada beeraha",
    title: "Grain Harvester",
    icon: <GiGrain size={32} />,
  },
];

export const jobsSubCategories: SubCategory[] = [
  {
    key: "FullTime",
    title: "Full-Time",
    href: "/jobs/full-time",
    so: "Shaqo Waqti-buuxa ah",
  },
  {
    key: "PartTime",
    title: "Part-Time",
    href: "/jobs/part-time",
    so: "Shaqo Waqti-kooban ah",
  },
  {
    key: "Physical",
    title: "Physical/Manual Labor",
    href: "/jobs/physical",
    so: "Shaqo Jidheed/Gacmeed",
  },
  {
    key: "Internship",
    title: "Internship",
    href: "/jobs/internship",
    so: "Tababar Shaqo",
  },
  {
    key: "Remote",
    title: "Remote",
    href: "/jobs/remote",
    so: "Shaqo Fog (Remote)",
  },
  {
    key: "Tech",
    title: "IT & Tech",
    href: "/jobs/tech",
    so: "Tiknooloojiyada",
  },
  {
    key: "Finance",
    title: "Finance & Accounting",
    href: "/jobs/finance",
    so: "Maaliyadda & Xisaabinta",
  },
  {
    key: "Education",
    title: "Education",
    href: "/jobs/education",
    so: "Waxbarashada",
  },
];
