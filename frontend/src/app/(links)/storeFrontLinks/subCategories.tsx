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
  labelKey?: string;
}

export const marketplaceSubCategories: CategoryOption[] = [
  {
    so: "Alaabta qadiimiga & farshaxanka",
    title: "Antiques & Art",
    labelKey: "subcategories.marketplace.antiques",
    icon: <FaPaintBrush />,
    href: "/Marketplace/antiques-and-art",
  },
  {
    so: "Telefoon, TV iyo qalab guri",
    title: "Electronics",
    labelKey: "subcategories.marketplace.electronics",
    icon: <FaTv />,
    href: "/Marketplace/electronics",
  },
  {
    so: "Xayawaan iyo agabka",
    title: "Animal & Supplies",
    labelKey: "subcategories.marketplace.animalAndSupplies",
    icon: <GiGoat />,
    href: "/Marketplace/animalAndSupplies-and-supplies",
  },
  {
    so: "Qalabka ciyaaraha & dibadda",
    title: "Sports & Outdoors",
    labelKey: "subcategories.marketplace.sportsAndOutdoors",
    icon: <MdSportsSoccer />,
    href: "/Marketplace/sports-and-outdoors",
  },
  {
    so: "Alaabta guriga & qurxinta",
    title: "Furniture",
    labelKey: "subcategories.marketplace.furniture",
    icon: <FaCouch />,
    href: "/Marketplace/furniture-and-interior",
  },
  {
    so: "Dharka, boorsooyinka & waxyaabo kale",
    title: "Fashion",
    labelKey: "subcategories.marketplace.fashion",
    icon: <FaTshirt />,
    href: "/Marketplace/fashion-and-accessories",
  },
];

export const realEstateSubCategories: CategoryOption[] = [
  {
    so: "Kirada",
    title: "For Rent",
    labelKey: "subcategories.realEstate.forRent",
    icon: <FaHome size={32} />,
  },
  {
    so: "Iib",
    title: "For Sale",
    labelKey: "subcategories.realEstate.forSale",
    icon: <FaDollarSign size={32} />,
  },
  {
    so: "Dhul iib ah",
    title: "Land for Sale",
    labelKey: "subcategories.realEstate.landForSale",
    icon: <GiField size={32} />,
  },
  {
    so: "Beer iib ah",
    title: "Farm for Sale",
    labelKey: "subcategories.realEstate.farmForSale",
    icon: <GiFarmer size={32} />,
  },
  {
    so: "Ganacsi",
    title: "Commercial",
    labelKey: "subcategories.realEstate.commercial",
    icon: <GiFarmer size={32} />,
  },
];

export const carsSubCategory: CategoryOption[] = [
  {
    so: "Gawaari iib ah",
    title: "Cars for Sale",
    labelKey: "subcategories.cars.carsForSale",
    icon: <FaCarSide size={28} />,
  },
  {
    so: "Gawaari kirayn",
    title: "Lease Cars",
    labelKey: "subcategories.cars.leaseCars",
    icon: <FaCar size={28} />,
  },
  {
    so: "rimoor",
    title: "Trailers",
    labelKey: "subcategories.cars.trailers",
    icon: <FaTrailer size={28} />,
  },
  {
    so: "Qaybaha gawaarida",
    title: "Car Parts",
    labelKey: "subcategories.cars.carParts",
    icon: <FaTools size={28} />,
  },
  {
    so: "Baabuur xamuul",
    title: "Truck",
    labelKey: "subcategories.cars.truck",
    icon: <FaTruckFront size={28} />,
  },
  {
    so: "Gawaari Koronto",
    title: "Electric Cars",
    labelKey: "subcategories.cars.electricCars",
    icon: <MdElectricCar size={28} />,
  },
  {
    so: "Basas",
    title: "Buses",
    labelKey: "subcategories.cars.buses",
    icon: <FaBus size={28} />,
  },
];

export const motorcyclesSubCategories: CategoryOption[] = [
  {
    so: "Beec ah",
    title: "for Sale",
    labelKey: "subcategories.motorcycles.forSale",
    icon: <FaMotorcycle size={32} />,
  },
  {
    so: "Kiro ah",
    title: "for Rent",
    labelKey: "subcategories.motorcycles.forRent",
    icon: <MdCarRental size={32} />,
  },
  {
    so: "Qaybaha",
    title: "Spare Parts",
    labelKey: "subcategories.motorcycles.spareParts",
    icon: <MdOutlineMiscellaneousServices size={32} />,
  },
  {
    so: "waxyaabaha kale",
    title: "Other",
    labelKey: "subcategories.motorcycles.other",
    icon: <FaToolbox size={32} />,
  },
];

export const boatsSubCategories: CategoryOption[] = [
  {
    so: "Doomo iib ah",
    title: "Boats for Sale",
    labelKey: "subcategories.boats.boatsForSale",
    icon: <FaShip size={28} />,
  },
  {
    so: "Doomo kireysi ah",
    title: "Boats for Rent",
    labelKey: "subcategories.boats.boatsForRent",
    icon: <GiBoatFishing size={28} />,
  },
  {
    so: "Matoorada doomo iib ah",
    title: "Boat Engines for Sale",
    labelKey: "subcategories.boats.boatEnginesForSale",
    icon: <GiBoatPropeller size={28} />,
  },
  {
    so: "Qaybaha doomo",
    title: "Boat Parts",
    labelKey: "subcategories.boats.boatParts",
    icon: <FaTools size={28} />,
  },
];

export const traktorSubCategories: TraktorSubCategoryItem[] = [
  {
    so: "Cagaf cagaf beec ah",
    title: "Tractor for Sale",
    labelKey: "subcategories.traktor.tractorForSale",
    icon: <GiFarmTractor size={32} />,
  },
  {
    so: "qalabka beeraha",
    title: "Farm Tools",
    labelKey: "subcategories.traktor.farmTools",
    icon: <FaTruckMoving size={32} />,
  },
  {
    so: "Faafiyaha bacriminta.",
    title: "Fertilizer Spreader",
    labelKey: "subcategories.traktor.fertilizerSpreader",
    icon: <GiFertilizerBag size={32} />,
  },
  {
    so: "Makiinada goosashada beeraha",
    title: "Grain Harvester",
    labelKey: "subcategories.traktor.grainHarvester",
    icon: <GiGrain size={32} />,
  },
];

export const jobsSubCategories: SubCategory[] = [
  {
    key: "FullTime",
    title: "Full-Time",
    href: "/jobs/full-time",
    so: "Shaqo Waqti-buuxa ah",
    labelKey: "subcategories.jobs.FullTime",
  },
  {
    key: "PartTime",
    title: "Part-Time",
    href: "/jobs/part-time",
    so: "Shaqo Waqti-kooban ah",
    labelKey: "subcategories.jobs.PartTime",
  },
  {
    key: "Physical",
    title: "Physical/Manual Labor",
    href: "/jobs/physical",
    so: "Shaqo Jidheed/Gacmeed",
    labelKey: "subcategories.jobs.Physical",
  },
  {
    key: "Internship",
    title: "Internship",
    href: "/jobs/internship",
    so: "Tababar Shaqo",
    labelKey: "subcategories.jobs.Internship",
  },
  {
    key: "Remote",
    title: "Remote",
    href: "/jobs/remote",
    so: "Shaqo Fog (Remote)",
    labelKey: "subcategories.jobs.Remote",
  },
  {
    key: "Tech",
    title: "IT & Tech",
    href: "/jobs/tech",
    so: "Tiknooloojiyada",
    labelKey: "subcategories.jobs.Tech",
  },
  {
    key: "Finance",
    title: "Finance & Accounting",
    href: "/jobs/finance",
    so: "Maaliyadda & Xisaabinta",
    labelKey: "subcategories.jobs.Finance",
  },
  {
    key: "Education",
    title: "Education",
    href: "/jobs/education",
    so: "Waxbarashada",
    labelKey: "subcategories.jobs.Education",
  },
];
