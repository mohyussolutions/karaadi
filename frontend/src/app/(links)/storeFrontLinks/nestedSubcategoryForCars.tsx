import { ReactElement } from "react";
import {
  FaCarSide,
  FaCar,
  FaTrailer,
  FaTruckFront,
  FaVanShuttle,
  FaBus,
  FaKey,
  FaSchool,
  FaTruck,
  FaWrench,
  FaCity,
} from "react-icons/fa6";
import { MdElectricCar } from "react-icons/md";
import { GiAutoRepair, GiCarKey } from "react-icons/gi";
import { FaCogs, FaTools } from "react-icons/fa";

export interface CarSubCategory {
  so: string;
  title: string;
  icon: ReactElement;
  labelKey?: string;
  key?: string;
}

const ICONS = {
  car: <FaCar size={20} />,
  carSide: <FaCarSide size={20} />,
  bus: <FaBus size={20} />,
  truck: <FaTruck size={20} />,
  key: <FaKey size={20} />,
  tools: <FaTools size={20} />,
  autoRepair: <GiAutoRepair size={20} />,
  truckFront: <FaTruckFront size={20} />,
  wrench: <FaWrench size={20} />,
  cogs: <FaCogs size={20} />,
  electricCar: <MdElectricCar size={20} />,
  carKey: <GiCarKey size={20} />,
  trailer: <FaTrailer size={20} />,
  busLarge: <FaBus size={24} />,
  vanShuttle: <FaVanShuttle size={24} />,
  school: <FaSchool size={24} />,
  city: <FaCity size={24} />,
  carSideLarge: <FaCarSide size={28} />,
  carLarge: <FaCar size={28} />,
  busLarge28: <FaBus size={28} />,
  trailerLarge: <FaTrailer size={28} />,
  toolsLarge: <FaTools size={28} />,
  truckFrontLarge: <FaTruckFront size={28} />,
  electricCarLarge: <MdElectricCar size={28} />,
} as const;

export const carsNestedData: Record<
  string,
  ReadonlyArray<CarSubCategory>
> = Object.freeze({
  CarsForSaleNestedSub: Object.freeze([
    {
      so: "Sedan iib ah",
      title: "Sedan",
      labelKey: "subcategories.carsNested.carsForSale.sedan",
      icon: ICONS.car,
    },
    {
      so: "SUV/4x4 iib ah",
      title: "SUV/4x4",
      labelKey: "subcategories.carsNested.carsForSale.suv",
      icon: ICONS.carSide,
    },
    {
      so: "Hatchback iib ah",
      title: "Hatchback",
      labelKey: "subcategories.carsNested.carsForSale.hatchback",
      icon: ICONS.car,
    },
    {
      so: "Convertible iib ah",
      title: "Convertible",
      labelKey: "subcategories.carsNested.carsForSale.convertible",
      icon: ICONS.car,
    },
    {
      so: "Minivan iib ah",
      title: "Minivan",
      labelKey: "subcategories.carsNested.carsForSale.minivan",
      icon: ICONS.car,
    },
  ]),
  LeaseCarsNestedSub: Object.freeze([
    {
      so: "Kiree Sedan",
      title: "Sedan Lease",
      labelKey: "subcategories.carsNested.lease.sedanLease",
      icon: ICONS.car,
    },
    {
      so: "Kiree SUV/4x4",
      title: "SUV/4x4 Lease",
      labelKey: "subcategories.carsNested.lease.suvLease",
      icon: ICONS.carSide,
    },
    {
      so: "Kiree Bas/Gaari weyn",
      title: "Van/Minibus Lease",
      labelKey: "subcategories.carsNested.lease.vanMinibusLease",
      icon: ICONS.bus,
    },
    {
      so: "Kiree Gaari Xamuul",
      title: "Truck/Pickup Lease",
      labelKey: "subcategories.carsNested.lease.truckPickupLease",
      icon: ICONS.truck,
    },
    {
      so: "Kirayn Wax kale",
      title: "Other Lease Vehicles",
      labelKey: "subcategories.carsNested.lease.otherLeaseVehicles",
      icon: ICONS.key,
    },
  ]),
  CarPartsNestedSub: Object.freeze([
    {
      so: "Matoorrada",
      title: "Engines",
      labelKey: "subcategories.carsNested.parts.engines",
      icon: ICONS.autoRepair,
    },
    {
      so: "Tires iyo Rimms",
      title: "Tires & Rims",
      labelKey: "subcategories.carsNested.parts.tiresRims",
      icon: ICONS.tools,
    },
    {
      so: "Qaybaha Jirka",
      title: "Body Parts",
      labelKey: "subcategories.carsNested.parts.bodyParts",
      icon: ICONS.tools,
    },
  ]),
  TruckNestedSub: Object.freeze([
    {
      so: "Pickup Truck iib ah",
      title: "Pickup Truck",
      labelKey: "subcategories.carsNested.trucks.pickupTruck",
      icon: ICONS.truckFront,
    },
    {
      so: "Heavy Truck iib ah",
      title: "Heavy Truck",
      labelKey: "subcategories.carsNested.trucks.heavyTruck",
      icon: ICONS.truckFront,
    },
    {
      so: "Qaybaha Truck Dheeraadka ah",
      title: "Truck Spare Parts",
      labelKey: "subcategories.carsNested.trucks.truckSpareParts",
      icon: ICONS.wrench,
    },
    {
      so: "Truck Furan/Cisterno iib ah",
      title: "Flatbed/Tank Truck",
      labelKey: "subcategories.carsNested.trucks.flatbedTankTruck",
      icon: ICONS.truckFront,
    },
    {
      so: "Truck kale iib ah",
      title: "Other Trucks",
      labelKey: "subcategories.carsNested.trucks.otherTrucks",
      icon: ICONS.cogs,
    },
  ]),
  ElectricCarsNestedSub: Object.freeze([
    {
      so: "Electric Sedan iib ah",
      title: "Electric Sedan",
      labelKey: "subcategories.carsNested.electric.electricSedan",
      icon: ICONS.electricCar,
    },
    {
      so: "Electric SUV iib ah",
      title: "Electric SUV",
      labelKey: "subcategories.carsNested.electric.electricSUV",
      icon: ICONS.electricCar,
    },
    {
      so: "Nooc Koronto Kale",
      title: "Other Electric Car",
      labelKey: "subcategories.carsNested.electric.otherElectricCar",
      icon: ICONS.carKey,
    },
  ]),
  TrailerNestedSub: Object.freeze([
    {
      so: "Boat Trailer iib ah",
      title: "Boat Trailer",
      labelKey: "subcategories.carsNested.trailers.boatTrailer",
      icon: ICONS.trailer,
    },
    {
      so: "Qaybaha Rimoorka Dheeraadka ah",
      title: "Trailer Spare Parts",
      labelKey: "subcategories.carsNested.trailers.trailerSpareParts",
      icon: ICONS.wrench,
    },
    {
      so: "Rimoor Xamuul Culus iib ah",
      title: "Heavy Duty Trailer",
      labelKey: "subcategories.carsNested.trailers.heavyDutyTrailer",
      icon: ICONS.trailer,
    },
    {
      so: "Rimoor kale iib ah",
      title: "Other Trailers",
      labelKey: "subcategories.carsNested.trailers.otherTrailers",
      icon: ICONS.cogs,
    },
  ]),
  BusSubLinks: Object.freeze([
    {
      so: "Basas Waaweyn",
      title: "Coach Buses",
      labelKey: "subcategories.carsNested.buses.coachBuses",
      icon: ICONS.busLarge,
    },
    {
      so: "Basaska Yar-yar",
      title: "Minibuses",
      labelKey: "subcategories.carsNested.buses.minibuses",
      icon: ICONS.vanShuttle,
    },
    {
      so: "Basaska Dugsiyada",
      title: "School Buses",
      labelKey: "subcategories.carsNested.buses.schoolBuses",
      icon: ICONS.school,
    },
    {
      so: "Basaska Magaalada",
      title: "City Buses",
      labelKey: "subcategories.carsNested.buses.cityBuses",
      icon: ICONS.city,
    },
  ]),
} as Record<string, ReadonlyArray<CarSubCategory>>);

export const BusSubLinks: ReadonlyArray<CarSubCategory> =
  carsNestedData.BusSubLinks;
export const TrailerNestedSub: ReadonlyArray<CarSubCategory> =
  carsNestedData.TrailerNestedSub;
export const TruckNestedSub: ReadonlyArray<CarSubCategory> =
  carsNestedData.TruckNestedSub;

export const carsSubCategories: ReadonlyArray<CarSubCategory> = Object.freeze([
  {
    so: "Gawaari iib ah",
    key: "carsForSale",
    title: "Cars for Sale",
    labelKey: "subcategories.carsNested.carsForSale.sedan",
    icon: ICONS.carSideLarge,
  },
  {
    so: "Gawaari kirayn",
    key: "leaseCars",
    title: "Lease Cars",
    labelKey: "subcategories.carsNested.lease.sedanLease",
    icon: ICONS.carLarge,
  },
  {
    so: "Basas",
    key: "buses",
    title: "Buses",
    labelKey: "subcategories.carsNested.buses.coachBuses",
    icon: ICONS.busLarge28,
  },
  {
    so: "rimoor",
    key: "trailers",
    title: "Trailers",
    labelKey: "subcategories.carsNested.trailers.boatTrailer",
    icon: ICONS.trailerLarge,
  },
  {
    so: "Qaybaha gawaarida",
    key: "carParts",
    title: "Car Parts",
    labelKey: "subcategories.carsNested.parts.engines",
    icon: ICONS.toolsLarge,
  },
  {
    so: "Baabuur xamuul",
    key: "truck",
    title: "Truck",
    labelKey: "subcategories.carsNested.trucks.pickupTruck",
    icon: ICONS.truckFrontLarge,
  },
  {
    so: "Gawaari Koronto",
    key: "electricCars",
    title: "Electric Cars",
    labelKey: "subcategories.carsNested.electric.electricSedan",
    icon: ICONS.electricCarLarge,
  },
]) as ReadonlyArray<CarSubCategory>;

export const carsNestedCategoriesMap: Record<
  string,
  ReadonlyArray<CarSubCategory>
> = Object.freeze({
  CarsForSaleNestedSub: carsNestedData.CarsForSaleNestedSub,
  LeaseCarsNestedSub: carsNestedData.LeaseCarsNestedSub,
  BusSubLinks: carsNestedData.BusSubLinks,
  TrailerNestedSub: carsNestedData.TrailerNestedSub,
  CarPartsNestedSub: carsNestedData.CarPartsNestedSub,
  TruckNestedSub: carsNestedData.TruckNestedSub,
  ElectricCarsNestedSub: carsNestedData.ElectricCarsNestedSub,
});
