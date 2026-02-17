import { ReactElement } from "react";
import {
  FaCarSide,
  FaCar,
  FaTrailer,
  FaTruckFront,
  FaVanShuttle,
} from "react-icons/fa6";
import { MdElectricCar } from "react-icons/md";
import { GiAutoRepair, GiCarKey } from "react-icons/gi";
import {
  FaBus,
  FaCogs,
  FaKey,
  FaSchool,
  FaTools,
  FaTruck,
  FaWrench,
  FaCity,
} from "react-icons/fa";

export interface CarSubCategory {
  so: string;
  title: string;
  icon: ReactElement;
}

export const CarsForSaleNestedSub: CarSubCategory[] = [
  { so: "Sedan iib ah", title: "Sedan", icon: <FaCar size={20} /> },
  { so: "SUV/4x4 iib ah", title: "SUV/4x4", icon: <FaCarSide size={20} /> },
  { so: "Hatchback iib ah", title: "Hatchback", icon: <FaCar size={20} /> },
  { so: "Convertible iib ah", title: "Convertible", icon: <FaCar size={20} /> },
  { so: "Minivan iib ah", title: "Minivan", icon: <FaCar size={20} /> },
];

export const LeaseCarsNestedSub: CarSubCategory[] = [
  { so: "Kiree Sedan", title: "Sedan Lease", icon: <FaCar size={20} /> },
  {
    so: "Kiree SUV/4x4",
    title: "SUV/4x4 Lease",
    icon: <FaCarSide size={20} />,
  },
  {
    so: "Kiree Bas/Gaari weyn",
    title: "Van/Minibus Lease",
    icon: <FaBus size={20} />,
  },
  {
    so: "Kiree Gaari Xamuul",
    title: "Truck/Pickup Lease",
    icon: <FaTruck size={20} />,
  },
  {
    so: "Kirayn Wax kale",
    title: "Other Lease Vehicles",
    icon: <FaKey size={20} />,
  },
];

export const CarPartsNestedSub: CarSubCategory[] = [
  { so: "Matoorrada", title: "Engines", icon: <GiAutoRepair size={20} /> },
  { so: "Tires iyo Rimms", title: "Tires & Rims", icon: <FaTools size={20} /> },
  { so: "Qaybaha Jirka", title: "Body Parts", icon: <FaTools size={20} /> },
];

export const TruckNestedSub: CarSubCategory[] = [
  {
    so: "Pickup Truck iib ah",
    title: "Pickup Truck",
    icon: <FaTruckFront size={20} />,
  },
  {
    so: "Heavy Truck iib ah",
    title: "Heavy Truck",
    icon: <FaTruckFront size={20} />,
  },
  {
    so: "Qaybaha Truck Dheeraadka ah",
    title: "Truck Spare Parts",
    icon: <FaWrench size={20} />,
  },
  {
    so: "Truck Furan/Cisterno iib ah",
    title: "Flatbed/Tank Truck",
    icon: <FaTruckFront size={20} />,
  },
  {
    so: "Truck kale iib ah",
    title: "Other Trucks",
    icon: <FaCogs size={20} />,
  },
];

export const ElectricCarsNestedSub: CarSubCategory[] = [
  {
    so: "Electric Sedan iib ah",
    title: "Electric Sedan",
    icon: <MdElectricCar size={20} />,
  },
  {
    so: "Electric SUV iib ah",
    title: "Electric SUV",
    icon: <MdElectricCar size={20} />,
  },
  {
    so: "Nooc Koronto Kale",
    title: "Other Electric Car",
    icon: <GiCarKey size={20} />,
  },
];

export const TrailerNestedSub: CarSubCategory[] = [
  {
    so: "Boat Trailer iib ah",
    title: "Boat Trailer",
    icon: <FaTrailer size={20} />,
  },
  {
    so: "Qaybaha Rimoorka Dheeraadka ah",
    title: "Trailer Spare Parts",
    icon: <FaWrench size={20} />,
  },
  {
    so: "Rimoor Xamuul Culus iib ah",
    title: "Heavy Duty Trailer",
    icon: <FaTrailer size={20} />,
  },
  {
    so: "Rimoor kale iib ah",
    title: "Other Trailers",
    icon: <FaCogs size={20} />,
  },
];

export const BusSubLinks: CarSubCategory[] = [
  { so: "Basas Waaweyn", title: "Coach Buses", icon: <FaBus size={24} /> },
  {
    so: "Basaska Yar-yar",
    title: "Minibuses",
    icon: <FaVanShuttle size={24} />,
  },
  {
    so: "Basaska Dugsiyada",
    title: "School Buses",
    icon: <FaSchool size={24} />,
  },
  { so: "Basaska Magaalada", title: "City Buses", icon: <FaCity size={24} /> },
];

export const carsSubCategories: CarSubCategory[] = [
  {
    so: "Gawaari iib ah",
    title: "Cars for Sale",
    icon: <FaCarSide size={28} />,
  },
  { so: "Gawaari kirayn", title: "Lease Cars", icon: <FaCar size={28} /> },
  { so: "Basas", title: "Buses", icon: <FaBus size={28} /> },
  { so: "rimoor", title: "Trailers", icon: <FaTrailer size={28} /> },
  { so: "Qaybaha gawaarida", title: "Car Parts", icon: <FaTools size={28} /> },
  { so: "Baabuur xamuul", title: "Truck", icon: <FaTruckFront size={28} /> },
  {
    so: "Gawaari Koronto",
    title: "Electric Cars",
    icon: <MdElectricCar size={28} />,
  },
];

export const carsNestedCategoriesMap: { [key: string]: CarSubCategory[] } = {
  "Cars for Sale": CarsForSaleNestedSub,
  "Lease Cars": LeaseCarsNestedSub,
  Buses: BusSubLinks,
  Trailers: TrailerNestedSub,
  "Car Parts": CarPartsNestedSub,
  Truck: TruckNestedSub,
  "Electric Cars": ElectricCarsNestedSub,
};
