export const marketplaceHrefToCategoryKey: Record<string, string> = {
  "/Marketplace/antiques-and-art": "Antiques & Art",
  "/Marketplace/electronics": "Electronics",
  "/Marketplace/animal-and-supplies": "Animal & Supplies",
  "/Marketplace/sports-and-outdoors": "Sports & Outdoors",
  "/Marketplace/furniture": "Furniture",
  "/Marketplace/fashion": "Fashion",
};

import { ICONS } from "@/app/utils/icons/categoryIcons";
import {
  BoatSubCategoryItem,
  CarSubCategory,
  CategoryOption,
  JobSubCategoryItem,
  MarketplaceSubCategoryItem,
  MotorcycleSubCategoryItem,
  RealEstateSubCategoryItem,
  TraktorSubCategoryItem,
} from "@/app/utils/types/nesSubCategoryTypes";

const BoatsForSaleNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishingBoat",
    name: "Fishing Boat",
    labelKey: "subcategories.boatsNested.boatsForSale.fishingBoat",
    icon: ICONS.giFishingBoat(),
    href: "/boats/for-sale/fishing-boat",
  },
  {
    key: "leisureYacht",
    name: "Leisure Yacht",
    labelKey: "subcategories.boatsNested.boatsForSale.leisureYacht",
    icon: ICONS.faShip(),
    href: "/boats/for-sale/leisure-yacht",
  },
  {
    key: "sailboat",
    name: "Sailboat",
    labelKey: "subcategories.boatsNested.boatsForSale.sailboat",
    icon: ICONS.giSailboat(),
    href: "/boats/for-sale/sailboat",
  },
  {
    key: "speedboat",
    name: "Speedboat",
    labelKey: "subcategories.boatsNested.boatsForSale.speedboat",
    icon: ICONS.ioBoatSharp(),
    href: "/boats/for-sale/speedboat",
  },
];

const BoatsForRentNestedSub: BoatSubCategoryItem[] = [
  {
    key: "fishingBoatRental",
    name: "Fishing Boat Rental",
    labelKey: "subcategories.boatsNested.boatsForRent.fishingBoatRental",
    icon: ICONS.giBoatFishing(),
    href: "/boats/for-rent/fishing-boat",
  },
  {
    key: "yachtCharter",
    name: "Yacht Charter",
    labelKey: "subcategories.boatsNested.boatsForRent.yachtCharter",
    icon: ICONS.faShip(),
    href: "/boats/for-rent/yacht-charter",
  },
];

const BoatEnginesNestedSub: BoatSubCategoryItem[] = [
  {
    key: "outboardEngine",
    name: "Outboard Engine",
    labelKey: "subcategories.boatsNested.engines.outboardEngine",
    icon: ICONS.giBoatPropeller(),
    href: "/boats/engines/outboard",
  },
  {
    key: "inboardEngine",
    name: "Inboard Engine",
    labelKey: "subcategories.boatsNested.engines.inboardEngine",
    icon: ICONS.faWrench(),
    href: "/boats/engines/inboard",
  },
  {
    key: "usedEngine",
    name: "Used Engine",
    labelKey: "subcategories.boatsNested.engines.usedEngine",
    icon: ICONS.faTools(),
    href: "/boats/engines/used",
  },
];

const BoatPartsNestedSub: BoatSubCategoryItem[] = [
  {
    key: "engineParts",
    name: "Engine Parts",
    labelKey: "subcategories.boatsNested.parts.engineParts",
    icon: ICONS.faWrench(),
    href: "/boats/parts/engine",
  },
  {
    key: "navigationEquipment",
    name: "Navigation Equipment",
    labelKey: "subcategories.boatsNested.parts.navigationEquipment",
    icon: ICONS.faShip(),
    href: "/boats/parts/navigation",
  },
  {
    key: "safetyGear",
    name: "Safety Gear",
    labelKey: "subcategories.boatsNested.parts.safetyGear",
    icon: ICONS.giBoatFishing(),
    href: "/boats/parts/safety-gear",
  },
];

const carsNestedData: Record<
  string,
  ReadonlyArray<CarSubCategory>
> = Object.freeze({
  CarsForSaleNestedSub: Object.freeze([
    {
      key: "sedan",
      name: "Sedan",
      labelKey: "subcategories.carsNested.carsForSale.sedan",
      icon: ICONS.car(),
      href: "/cars/for-sale/sedan",
    },
    {
      key: "suv",
      name: "SUV",
      labelKey: "subcategories.carsNested.carsForSale.suv",
      icon: ICONS.carSide(),
      href: "/cars/for-sale/suv",
    },
    {
      key: "hatchback",
      name: "Hatchback",
      labelKey: "subcategories.carsNested.carsForSale.hatchback",
      icon: ICONS.car(),
      href: "/cars/for-sale/hatchback",
    },
    {
      key: "convertible",
      name: "Convertible",
      labelKey: "subcategories.carsNested.carsForSale.convertible",
      icon: ICONS.car(),
      href: "/cars/for-sale/convertible",
    },
    {
      key: "minivan",
      name: "Minivan",
      labelKey: "subcategories.carsNested.carsForSale.minivan",
      icon: ICONS.car(),
      href: "/cars/for-sale/minivan",
    },
  ]),
  LeaseCarsNestedSub: Object.freeze([
    {
      key: "sedanLease",
      name: "Sedan Lease",
      labelKey: "subcategories.carsNested.lease.sedanLease",
      icon: ICONS.car(),
      href: "/cars/lease/sedan",
    },
    {
      key: "suvLease",
      name: "SUV Lease",
      labelKey: "subcategories.carsNested.lease.suvLease",
      icon: ICONS.carSide(),
      href: "/cars/lease/suv",
    },
    {
      key: "vanMinibusLease",
      name: "Van/Minibus Lease",
      labelKey: "subcategories.carsNested.lease.vanMinibusLease",
      icon: ICONS.bus(),
      href: "/cars/lease/van",
    },
    {
      key: "truckPickupLease",
      name: "Truck/Pickup Lease",
      labelKey: "subcategories.carsNested.lease.truckPickupLease",
      icon: ICONS.truck(),
      href: "/cars/lease/truck",
    },
    {
      key: "otherLeaseVehicles",
      name: "Other Lease Vehicles",
      labelKey: "subcategories.carsNested.lease.otherLeaseVehicles",
      icon: ICONS.key(),
      href: "/cars/lease/other",
    },
  ]),
  CarPartsNestedSub: Object.freeze([
    {
      key: "engines",
      name: "Engines",
      labelKey: "subcategories.carsNested.parts.engines",
      icon: ICONS.autoRepair(),
      href: "/cars/parts/engines",
    },
    {
      key: "tiresRims",
      name: "Tires & Rims",
      labelKey: "subcategories.carsNested.parts.tiresRims",
      icon: ICONS.tools(),
      href: "/cars/parts/tires",
    },
    {
      key: "bodyParts",
      name: "Body Parts",
      labelKey: "subcategories.carsNested.parts.bodyParts",
      icon: ICONS.tools(),
      href: "/cars/parts/body",
    },
  ]),
  TruckNestedSub: Object.freeze([
    {
      key: "pickupTruck",
      name: "Pickup Truck",
      labelKey: "subcategories.carsNested.trucks.pickupTruck",
      icon: ICONS.truckFront(),
      href: "/cars/trucks/pickup",
    },
    {
      key: "heavyTruck",
      name: "Heavy Truck",
      labelKey: "subcategories.carsNested.trucks.heavyTruck",
      icon: ICONS.truckFront(),
      href: "/cars/trucks/heavy",
    },
    {
      key: "truckSpareParts",
      name: "Truck Spare Parts",
      labelKey: "subcategories.carsNested.trucks.truckSpareParts",
      icon: ICONS.wrench(),
      href: "/cars/trucks/parts",
    },
    {
      key: "flatbedTankTruck",
      name: "Flatbed/Tank Truck",
      labelKey: "subcategories.carsNested.trucks.flatbedTankTruck",
      icon: ICONS.truckFront(),
      href: "/cars/trucks/flatbed",
    },
    {
      key: "otherTrucks",
      name: "Other Trucks",
      labelKey: "subcategories.carsNested.trucks.otherTrucks",
      icon: ICONS.cogs(),
      href: "/cars/trucks/other",
    },
  ]),
  ElectricCarsNestedSub: Object.freeze([
    {
      key: "electricSedan",
      name: "Electric Sedan",
      labelKey: "subcategories.carsNested.electric.electricSedan",
      icon: ICONS.electricCar(),
      href: "/cars/electric/sedan",
    },
    {
      key: "electricSUV",
      name: "Electric SUV",
      labelKey: "subcategories.carsNested.electric.electricSUV",
      icon: ICONS.electricCar(),
      href: "/cars/electric/suv",
    },
    {
      key: "otherElectricCar",
      name: "Other Electric Car",
      labelKey: "subcategories.carsNested.electric.otherElectricCar",
      icon: ICONS.carKey(),
      href: "/cars/electric/other",
    },
  ]),
  TrailerNestedSub: Object.freeze([
    {
      key: "boatTrailer",
      name: "Boat Trailer",
      labelKey: "subcategories.carsNested.trailers.boatTrailer",
      icon: ICONS.trailer(),
      href: "/cars/trailers/boat",
    },
    {
      key: "trailerSpareParts",
      name: "Trailer Spare Parts",
      labelKey: "subcategories.carsNested.trailers.trailerSpareParts",
      icon: ICONS.wrench(),
      href: "/cars/trailers/parts",
    },
    {
      key: "heavyDutyTrailer",
      name: "Heavy Duty Trailer",
      labelKey: "subcategories.carsNested.trailers.heavyDutyTrailer",
      icon: ICONS.trailer(),
      href: "/cars/trailers/heavy",
    },
    {
      key: "otherTrailers",
      name: "Other Trailers",
      labelKey: "subcategories.carsNested.trailers.otherTrailers",
      icon: ICONS.cogs(),
      href: "/cars/trailers/other",
    },
  ]),
  BusSubLinks: Object.freeze([
    {
      key: "coachBuses",
      name: "Coach Buses",
      labelKey: "subcategories.carsNested.buses.coachBuses",
      icon: ICONS.busLarge(),
      href: "/cars/buses/coach",
    },
    {
      key: "minibuses",
      name: "Minibuses",
      labelKey: "subcategories.carsNested.buses.minibuses",
      icon: ICONS.vanShuttle(),
      href: "/cars/buses/minibus",
    },
    {
      key: "schoolBuses",
      name: "School Buses",
      labelKey: "subcategories.carsNested.buses.schoolBuses",
      icon: ICONS.school(),
      href: "/cars/buses/school",
    },
    {
      key: "cityBuses",
      name: "City Buses",
      labelKey: "subcategories.carsNested.buses.cityBuses",
      icon: ICONS.city(),
      href: "/cars/buses/city",
    },
  ]),
});

const carsSubCategories: ReadonlyArray<CarSubCategory> = Object.freeze([
  {
    key: "sedan",
    name: "Sedan",
    labelKey: "subcategories.carsNested.carsForSale.sedan",
    icon: ICONS.carSideLarge(),
    href: "/cars/for-sale/sedan",
  },
  {
    key: "sedanLease",
    name: "Sedan Lease",
    labelKey: "subcategories.carsNested.lease.sedanLease",
    icon: ICONS.carLarge(),
    href: "/cars/lease/sedan",
  },
  {
    key: "coachBuses",
    name: "Coach Buses",
    labelKey: "subcategories.carsNested.buses.coachBuses",
    icon: ICONS.busLarge28(),
    href: "/cars/buses/coach",
  },
  {
    key: "boatTrailer",
    name: "Boat Trailer",
    labelKey: "subcategories.carsNested.trailers.boatTrailer",
    icon: ICONS.trailerLarge(),
    href: "/cars/trailers/boat",
  },
  {
    key: "engines",
    name: "Engines",
    labelKey: "subcategories.carsNested.parts.engines",
    icon: ICONS.toolsLarge(),
    href: "/cars/parts/engines",
  },
  {
    key: "pickupTruck",
    name: "Pickup Truck",
    labelKey: "subcategories.carsNested.trucks.pickupTruck",
    icon: ICONS.truckFrontLarge(),
    href: "/cars/trucks/pickup",
  },
  {
    key: "electricSedan",
    name: "Electric Sedan",
    labelKey: "subcategories.carsNested.electric.electricSedan",
    icon: ICONS.electricCarLarge(),
    href: "/cars/electric/sedan",
  },
]);

const jobMainCategoriesSo: { [key: string]: string } = {
  fullTimeJobs: "Shaqo Waqti Buuxa",
  partTimeJobs: "Shaqo Waqti Gaaban",
  freelanceGigs: "Shaqo Xor ah / Kiish",
};

const FullTimeJobsNestedSub: JobSubCategoryItem[] = [
  {
    key: "administrationOffice",
    name: "Administration/Office",
    icon: ICONS.building(),
    labelKey: "subcategories.jobsNested.fullTime.administrationOffice",
    href: "/jobs/full-time/administration",
  },
  {
    key: "itTechnology",
    name: "IT/Technology",
    icon: ICONS.computer(),
    labelKey: "subcategories.jobsNested.fullTime.itTechnology",
    href: "/jobs/full-time/it",
  },
  {
    key: "healthcare",
    name: "Healthcare",
    icon: ICONS.hospital(),
    labelKey: "subcategories.jobsNested.fullTime.healthcare",
    href: "/jobs/full-time/healthcare",
  },
  {
    key: "salesMarketing",
    name: "Sales/Marketing",
    icon: ICONS.userTie(),
    labelKey: "subcategories.jobsNested.fullTime.salesMarketing",
    href: "/jobs/full-time/sales",
  },
  {
    key: "engineeringConstruction",
    name: "Engineering/Construction",
    icon: ICONS.wrench(),
    labelKey: "subcategories.jobsNested.fullTime.engineeringConstruction",
    href: "/jobs/full-time/engineering",
  },
];

const PartTimeJobsNestedSub: JobSubCategoryItem[] = [
  {
    key: "officeAssistant",
    name: "Office Assistant",
    icon: ICONS.building(),
    labelKey: "subcategories.jobsNested.partTime.officeAssistant",
    href: "/jobs/part-time/assistant",
  },
  {
    key: "studentEmployment",
    name: "Student Employment",
    icon: ICONS.userTie(),
    labelKey: "subcategories.jobsNested.partTime.studentEmployment",
    href: "/jobs/part-time/student",
  },
  {
    key: "foodDeliveryRunner",
    name: "Food Delivery Runner",
    icon: ICONS.motorcycle(),
    labelKey: "subcategories.jobsNested.partTime.foodDeliveryRunner",
    href: "/jobs/part-time/delivery",
  },
];

const FreelanceGigsNestedSub: JobSubCategoryItem[] = [
  {
    key: "graphicDesigner",
    name: "Graphic Designer",
    icon: ICONS.paintbrush(),
    labelKey: "subcategories.jobsNested.freelance.graphicDesigner",
    href: "/jobs/freelance/designer",
  },
  {
    key: "webDeveloper",
    name: "Web Developer",
    icon: ICONS.computer(),
    labelKey: "subcategories.jobsNested.freelance.webDeveloper",
    href: "/jobs/freelance/developer",
  },
  {
    key: "freelanceWriter",
    name: "Freelance Writer",
    icon: ICONS.userTie(),
    labelKey: "subcategories.jobsNested.freelance.freelanceWriter",
    href: "/jobs/freelance/writer",
  },
];

const experienceLevels = [
  {
    key: "entry",
    name: "Entry Level",
    labelKey: "subcategories.jobsNested.experienceLevels.entry",
    icon: ICONS.star(),
    href: "/jobs/experience/entry",
  },
  {
    key: "mid",
    name: "Mid Level",
    labelKey: "subcategories.jobsNested.experienceLevels.mid",
    icon: ICONS.star(),
    href: "/jobs/experience/mid",
  },
  {
    key: "senior",
    name: "Senior Level",
    labelKey: "subcategories.jobsNested.experienceLevels.senior",
    icon: ICONS.star(),
    href: "/jobs/experience/senior",
  },
];

const educationLevels = [
  {
    key: "highschool",
    name: "High School",
    labelKey: "subcategories.jobsNested.educationLevels.highschool",
    icon: ICONS.school(),
    href: "/jobs/education/highschool",
  },
  {
    key: "diploma",
    name: "Diploma",
    labelKey: "subcategories.jobsNested.educationLevels.diploma",
    icon: ICONS.school(),
    href: "/jobs/education/diploma",
  },
  {
    key: "bachelor",
    name: "Bachelor's",
    labelKey: "subcategories.jobsNested.educationLevels.bachelor",
    icon: ICONS.school(),
    href: "/jobs/education/bachelor",
  },
  {
    key: "master",
    name: "Master's/PhD",
    labelKey: "subcategories.jobsNested.educationLevels.master",
    icon: ICONS.school(),
    href: "/jobs/education/master",
  },
];

const applicationMethods = [
  {
    key: "email",
    name: "Apply by Email",
    labelKey: "subcategories.jobsNested.applicationMethods.email",
    icon: ICONS.faEnvelope(),
    href: "/jobs/apply/email",
  },
  {
    key: "url",
    name: "Apply by Website/URL",
    labelKey: "subcategories.jobsNested.applicationMethods.url",
    icon: ICONS.school(),
    href: "/jobs/apply/url",
  },
  {
    key: "phone",
    name: "Call/Contact by Phone",
    labelKey: "subcategories.jobsNested.applicationMethods.phone",
    icon: ICONS.faPhone(),
    href: "/jobs/apply/phone",
  },
];

export const AntiquesAndArtNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "bowls",
    name: "Bowls",
    labelKey: "subcategories.marketplaceNested.antiques.bowls",
    icon: ICONS.utensils(),
    href: "/marketplace/antiques/bowls",
  },
  {
    key: "parts",
    name: "Parts",
    labelKey: "subcategories.marketplaceNested.antiques.parts",
    icon: ICONS.star(),
    href: "/marketplace/antiques/parts",
  },
  {
    key: "coffeeService",
    name: "Coffee Service",
    labelKey: "subcategories.marketplaceNested.antiques.coffeeService",
    icon: ICONS.mugHot(),
    href: "/marketplace/antiques/coffee",
  },
  {
    key: "porcelain",
    name: "Porcelain",
    labelKey: "subcategories.marketplaceNested.antiques.porcelain",
    icon: ICONS.utensils(),
    href: "/marketplace/antiques/porcelain",
  },
  {
    key: "vintage",
    name: "Vintage",
    labelKey: "subcategories.marketplaceNested.antiques.vintage",
    icon: ICONS.palette(),
    href: "/marketplace/antiques/vintage",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.antiques.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/antiques/other",
  },
];

export const ElectronicsNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "mobilePhones",
    name: "Mobile Phones",
    labelKey: "subcategories.marketplaceNested.electronics.mobilePhones",
    icon: ICONS.tv(),
    href: "/marketplace/electronics/phones",
  },
  {
    key: "laptopsComputers",
    name: "Laptops & Computers",
    labelKey: "subcategories.marketplaceNested.electronics.laptopsComputers",
    icon: ICONS.laptop(),
    href: "/marketplace/electronics/computers",
  },
  {
    key: "tvsAccessories",
    name: "TVs & Accessories",
    labelKey: "subcategories.marketplaceNested.electronics.tvsAccessories",
    icon: ICONS.tv(),
    href: "/marketplace/electronics/tvs",
  },
  {
    key: "camerasPhotography",
    name: "Cameras & Photography",
    labelKey: "subcategories.marketplaceNested.electronics.camerasPhotography",
    icon: ICONS.camera(),
    href: "/marketplace/electronics/cameras",
  },
  {
    key: "homeAppliances",
    name: "Home Appliances",
    labelKey: "subcategories.marketplaceNested.electronics.homeAppliances",
    icon: ICONS.tools(),
    href: "/marketplace/electronics/appliances",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.electronics.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/electronics/other",
  },
];

export const AnimalAndSuppliesNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "livestock",
    name: "Livestock",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.livestock",
    icon: ICONS.goat(),
    href: "/marketplace/animals/livestock",
  },
  {
    key: "pets",
    name: "Pets",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.pets",
    icon: ICONS.paw(),
    href: "/marketplace/animals/pets",
  },
  {
    key: "feed",
    name: "Feed",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.feed",
    icon: ICONS.fertilizerBag(),
    href: "/marketplace/animals/feed",
  },
  {
    key: "accessories",
    name: "Accessories",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.accessories",
    icon: ICONS.toolbox(),
    href: "/marketplace/animals/accessories",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.animalAndSupplies.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/animals/other",
  },
];

export const SportsAndOutdoorsNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "gymEquipment",
    name: "Gym Equipment",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.gymEquipment",
    icon: ICONS.dumbbell(),
    href: "/marketplace/sports/gym",
  },
  {
    key: "bicycles",
    name: "Bicycles",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.bicycles",
    icon: ICONS.bicycle(),
    href: "/marketplace/sports/bicycles",
  },
  {
    key: "sportingGoods",
    name: "Sporting Goods",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.sportingGoods",
    icon: ICONS.star(),
    href: "/marketplace/sports/goods",
  },
  {
    key: "campingGear",
    name: "Camping Gear",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.campingGear",
    icon: ICONS.faShip(),
    href: "/marketplace/sports/camping",
  },
  {
    key: "toys",
    name: "Toys",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.toys",
    icon: ICONS.puzzlePiece(),
    href: "/marketplace/sports/toys",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.sportsAndOutdoors.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/sports/other",
  },
];

export const FurnitureNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "sofasCouches",
    name: "Sofas & Couches",
    labelKey: "subcategories.marketplaceNested.furniture.sofasCouches",
    icon: ICONS.couch(),
    href: "/marketplace/furniture/sofas",
  },
  {
    key: "bedsMattresses",
    name: "Beds & Mattresses",
    labelKey: "subcategories.marketplaceNested.furniture.bedsMattresses",
    icon: ICONS.home(),
    href: "/marketplace/furniture/beds",
  },
  {
    key: "tablesDesks",
    name: "Tables & Desks",
    labelKey: "subcategories.marketplaceNested.furniture.tablesDesks",
    icon: ICONS.utensils(),
    href: "/marketplace/furniture/tables",
  },
  {
    key: "kitchenFurnishings",
    name: "Kitchen Furnishings",
    labelKey: "subcategories.marketplaceNested.furniture.kitchenFurnishings",
    icon: ICONS.mugHot(),
    href: "/marketplace/furniture/kitchen",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.furniture.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/furniture/other",
  },
];

export const FashionNestedSub: MarketplaceSubCategoryItem[] = [
  {
    key: "mensClothing",
    name: "Men's Clothing",
    labelKey: "subcategories.marketplaceNested.fashion.mensClothing",
    icon: ICONS.tshirt(),
    href: "/marketplace/fashion/men",
  },
  {
    key: "womensClothing",
    name: "Women's Clothing",
    labelKey: "subcategories.marketplaceNested.fashion.womensClothing",
    icon: ICONS.tshirt(),
    href: "/marketplace/fashion/women",
  },
  {
    key: "shoesFootwear",
    name: "Shoes & Footwear",
    labelKey: "subcategories.marketplaceNested.fashion.shoesFootwear",
    icon: ICONS.star(),
    href: "/marketplace/fashion/shoes",
  },
  {
    key: "bagsWallets",
    name: "Bags & Wallets",
    labelKey: "subcategories.marketplaceNested.fashion.bagsWallets",
    icon: ICONS.briefcase(),
    href: "/marketplace/fashion/bags",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.marketplaceNested.fashion.other",
    icon: ICONS.wineGlass(),
    href: "/marketplace/fashion/other",
  },
];

const MotorcyclesForNestedSub: MotorcycleSubCategoryItem[] = [
  {
    key: "newMotorcycle",
    name: "New Motorcycle",
    labelKey: "subcategories.motorcyclesNested.forSale.newMotorcycle",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/new",
  },
  {
    key: "usedMotorcycle",
    name: "Used Motorcycle",
    labelKey: "subcategories.motorcyclesNested.forSale.usedMotorcycle",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/used",
  },
  {
    key: "newVespa",
    name: "New Vespa",
    labelKey: "subcategories.motorcyclesNested.forSale.newVespa",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/new-vespa",
  },
  {
    key: "usedVespa",
    name: "Used Vespa",
    labelKey: "subcategories.motorcyclesNested.forSale.usedVespa",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/used-vespa",
  },
  {
    key: "newBajaj",
    name: "New Bajaj",
    labelKey: "subcategories.motorcyclesNested.forSale.newBajaj",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/new-bajaj",
  },
  {
    key: "usedBajaj",
    name: "Used Bajaj",
    labelKey: "subcategories.motorcyclesNested.forSale.usedBajaj",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-sale/used-bajaj",
  },
  {
    key: "sportBikes",
    name: "Sport Bikes",
    labelKey: "subcategories.motorcyclesNested.forSale.sportBikes",
    icon: ICONS.bicycle(),
    href: "/motorcycles/for-sale/sport",
  },
  {
    key: "cargoBikes",
    name: "Cargo Bikes",
    labelKey: "subcategories.motorcyclesNested.forSale.cargoBikes",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-sale/cargo",
  },
  {
    key: "cargoBajaj",
    name: "Cargo Bajaj",
    labelKey: "subcategories.motorcyclesNested.forSale.cargoBajaj",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-sale/cargo-bajaj",
  },
];

const MotorcycleRentNestedSub: MotorcycleSubCategoryItem[] = [
  {
    key: "motorcycleRental",
    name: "Motorcycle Rental",
    labelKey: "subcategories.motorcyclesNested.forRent.motorcycleRental",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-rent/motorcycle",
  },
  {
    key: "vespaRental",
    name: "Vespa Rental",
    labelKey: "subcategories.motorcyclesNested.forRent.vespaRental",
    icon: ICONS.motorcycle(),
    href: "/motorcycles/for-rent/vespa",
  },
  {
    key: "cargoMotorcycleRental",
    name: "Cargo Motorcycle Rental",
    labelKey: "subcategories.motorcyclesNested.forRent.cargoMotorcycleRental",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-rent/cargo",
  },
  {
    key: "bajajForRent",
    name: "Bajaj For Rent",
    labelKey: "subcategories.motorcyclesNested.forRent.bajajForRent",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-rent/bajaj",
  },
  {
    key: "cargoBajajRental",
    name: "Cargo Bajaj Rental",
    labelKey: "subcategories.motorcyclesNested.forRent.cargoBajajRental",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-rent/cargo-bajaj",
  },
  {
    key: "dailyBajajRental",
    name: "Daily Bajaj Rental",
    labelKey: "subcategories.motorcyclesNested.forRent.dailyBajajRental",
    icon: ICONS.truckMoving(),
    href: "/motorcycles/for-rent/daily-bajaj",
  },
];

const MCPartsNestedSub: MotorcycleSubCategoryItem[] = [
  {
    key: "motorcycleEngines",
    name: "Motorcycle Engines",
    labelKey: "subcategories.motorcyclesNested.parts.motorcycleEngines",
    icon: ICONS.autoRepair(),
    href: "/motorcycles/parts/engines",
  },
  {
    key: "tiresRims",
    name: "Tires & Rims",
    labelKey: "subcategories.motorcyclesNested.parts.tiresRims",
    icon: ICONS.tools(),
    href: "/motorcycles/parts/tires",
  },
  {
    key: "protectiveGear",
    name: "Protective Gear",
    labelKey: "subcategories.motorcyclesNested.parts.protectiveGear",
    icon: ICONS.toolbox(),
    href: "/motorcycles/parts/gear",
  },
  {
    key: "bajajEngines",
    name: "Bajaj Engines",
    labelKey: "subcategories.motorcyclesNested.parts.bajajEngines",
    icon: ICONS.autoRepair(),
    href: "/motorcycles/parts/bajaj-engines",
  },
  {
    key: "bajajBodyParts",
    name: "Bajaj Body Parts",
    labelKey: "subcategories.motorcyclesNested.parts.bajajBodyParts",
    icon: ICONS.tools(),
    href: "/motorcycles/parts/bajaj-body",
  },
];

const OtherNestedSub: MotorcycleSubCategoryItem[] = [
  {
    key: "miscellaneousEquipment",
    name: "Miscellaneous Equipment",
    labelKey: "subcategories.motorcyclesNested.other.miscellaneousEquipment",
    icon: ICONS.toolbox(),
    href: "/motorcycles/other/equipment",
  },
];

const RealEstateForRentNestedSub: RealEstateSubCategoryItem[] = [
  {
    key: "apartmentFlat",
    name: "Apartment/Flat",
    labelKey: "subcategories.realEstateNested.forRent.apartmentFlat",
    icon: ICONS.building(),
    href: "/real-estate/for-rent/apartment",
  },
  {
    key: "houseVilla",
    name: "House/Villa",
    labelKey: "subcategories.realEstateNested.forRent.houseVilla",
    icon: ICONS.home(),
    href: "/real-estate/for-rent/house",
  },
  {
    key: "commercialOffice",
    name: "Commercial Office",
    labelKey: "subcategories.realEstateNested.forRent.commercialOffice",
    icon: ICONS.store(),
    href: "/real-estate/for-rent/office",
  },
  {
    key: "warehouseStorage",
    name: "Warehouse/Storage",
    labelKey: "subcategories.realEstateNested.forRent.warehouseStorage",
    icon: ICONS.warehouse(),
    href: "/real-estate/for-rent/warehouse",
  },
  {
    key: "singleRoom",
    name: "Single Room",
    labelKey: "subcategories.realEstateNested.forRent.singleRoom",
    icon: ICONS.home(),
    href: "/real-estate/for-rent/room",
  },
];

const RealEstateForSaleNestedSub: RealEstateSubCategoryItem[] = [
  {
    key: "newHouseVilla",
    name: "New House/Villa",
    labelKey: "subcategories.realEstateNested.forSale.newHouseVilla",
    icon: ICONS.home(),
    href: "/real-estate/for-sale/new-house",
  },
  {
    key: "usedHouseVilla",
    name: "Used House/Villa",
    labelKey: "subcategories.realEstateNested.forSale.usedHouseVilla",
    icon: ICONS.home(),
    href: "/real-estate/for-sale/used-house",
  },
  {
    key: "apartmentFlatForSale",
    name: "Apartment/Flat For Sale",
    labelKey: "subcategories.realEstateNested.forSale.apartmentFlatForSale",
    icon: ICONS.building(),
    href: "/real-estate/for-sale/apartment",
  },
  {
    key: "completedBuilding",
    name: "Completed Building",
    labelKey: "subcategories.realEstateNested.forSale.completedBuilding",
    icon: ICONS.building(),
    href: "/real-estate/for-sale/building",
  },
];

const RealEstateLandForSaleNestedSub: RealEstateSubCategoryItem[] = [
  {
    key: "residentialLand",
    name: "Residential Land",
    labelKey: "subcategories.realEstateNested.landForSale.residentialLand",
    icon: ICONS.brickWall(),
    href: "/real-estate/land/residential",
  },
  {
    key: "commercialLand",
    name: "Commercial Land",
    labelKey: "subcategories.realEstateNested.landForSale.commercialLand",
    icon: ICONS.store(),
    href: "/real-estate/land/commercial",
  },
  {
    key: "industrialLand",
    name: "Industrial Land",
    labelKey: "subcategories.realEstateNested.landForSale.industrialLand",
    icon: ICONS.truckMoving(),
    href: "/real-estate/land/industrial",
  },
];

const RealEstateFarmForSaleNestedSub: RealEstateSubCategoryItem[] = [
  {
    key: "agriculturalLand",
    name: "Agricultural Land",
    labelKey: "subcategories.realEstateNested.farmForSale.agriculturalLand",
    icon: ICONS.field(),
    href: "/real-estate/farm/agricultural",
  },
  {
    key: "livestockFarm",
    name: "Livestock Farm",
    labelKey: "subcategories.realEstateNested.farmForSale.livestockFarm",
    icon: ICONS.farmer(),
    href: "/real-estate/farm/livestock",
  },
  {
    key: "treeForestFarms",
    name: "Tree/Forest Farms",
    labelKey: "subcategories.realEstateNested.farmForSale.treeForestFarms",
    icon: ICONS.tree(),
    href: "/real-estate/farm/forest",
  },
];

const RealEstateCommercialNestedSub: RealEstateSubCategoryItem[] = [
  {
    key: "retailSpaceShop",
    name: "Retail Space/Shop",
    labelKey: "subcategories.realEstateNested.commercial.retailSpaceShop",
    icon: ICONS.store(),
    href: "/real-estate/commercial/retail",
  },
  {
    key: "hotelGuesthouse",
    name: "Hotel/Guesthouse",
    labelKey: "subcategories.realEstateNested.commercial.hotelGuesthouse",
    icon: ICONS.building(),
    href: "/real-estate/commercial/hotel",
  },
  {
    key: "commercialBuilding",
    name: "Commercial Building",
    labelKey: "subcategories.realEstateNested.commercial.commercialBuilding",
    icon: ICONS.building(),
    href: "/real-estate/commercial/building",
  },
  {
    key: "largeWarehouse",
    name: "Large Warehouse",
    labelKey: "subcategories.realEstateNested.commercial.largeWarehouse",
    icon: ICONS.warehouse(),
    href: "/real-estate/commercial/warehouse",
  },
];

const TraktorTopCategories: CategoryOption[] = [
  {
    key: "tractorForSale",
    name: "Tractor For Sale",
    labelKey: "subcategories.traktorNested.top.tractorForSale",
    icon: ICONS.farmTractor32(),
    href: "/farm-equipment/tractor",
  },
  {
    key: "farmTools",
    name: "Farm Tools",
    labelKey: "subcategories.traktorNested.top.farmTools",
    icon: ICONS.truckMoving32(),
    href: "/farm-equipment/tools",
  },
  {
    key: "fertilizerSpreader",
    name: "Fertilizer Spreader",
    labelKey: "subcategories.traktorNested.top.fertilizerSpreader",
    icon: ICONS.fertilizerBag32(),
    href: "/farm-equipment/fertilizer",
  },
  {
    key: "grainHarvester",
    name: "Grain Harvester",
    labelKey: "subcategories.traktorNested.top.grainHarvester",
    icon: ICONS.grain32(),
    href: "/farm-equipment/harvester",
  },
];

const TractorForSaleNestedSub: TraktorSubCategoryItem[] = [
  {
    key: "newTractor",
    name: "New Tractor",
    labelKey: "subcategories.traktorNested.tractorForSale.newTractor",
    icon: ICONS.farmTractor20(),
    href: "/farm-equipment/tractor/new",
  },
  {
    key: "usedTractor",
    name: "Used Tractor",
    labelKey: "subcategories.traktorNested.tractorForSale.usedTractor",
    icon: ICONS.farmTractor20(),
    href: "/farm-equipment/tractor/used",
  },
];

const FarmToolsNestedSub: TraktorSubCategoryItem[] = [
  {
    key: "plowTillageEquipment",
    name: "Plow/Tillage Equipment",
    labelKey: "subcategories.traktorNested.farmTools.plowTillageEquipment",
    icon: ICONS.tools20(),
    href: "/farm-equipment/tools/plow",
  },
  {
    key: "seedingEquipment",
    name: "Seeding Equipment",
    labelKey: "subcategories.traktorNested.farmTools.seedingEquipment",
    icon: ICONS.tools20(),
    href: "/farm-equipment/tools/seeding",
  },
  {
    key: "harvestingEquipment",
    name: "Harvesting Equipment",
    labelKey: "subcategories.traktorNested.farmTools.harvestingEquipment",
    icon: ICONS.tools20(),
    href: "/farm-equipment/tools/harvesting",
  },
];

const FertilizerSpreaderNestedSub: TraktorSubCategoryItem[] = [
  {
    key: "mountedSpreader",
    name: "Mounted Spreader",
    labelKey: "subcategories.traktorNested.fertilizerSpreader.mountedSpreader",
    icon: ICONS.fertilizerBag20(),
    href: "/farm-equipment/fertilizer/mounted",
  },
  {
    key: "towedSpreader",
    name: "Towed Spreader",
    labelKey: "subcategories.traktorNested.fertilizerSpreader.towedSpreader",
    icon: ICONS.fertilizerBag20(),
    href: "/farm-equipment/fertilizer/towed",
  },
];

const GrainHarvesterNestedSub: TraktorSubCategoryItem[] = [
  {
    key: "selfPropelledHarvester",
    name: "Self-Propelled Harvester",
    labelKey:
      "subcategories.traktorNested.grainHarvester.selfPropelledHarvester",
    icon: ICONS.grain20(),
    href: "/farm-equipment/harvester/self-propelled",
  },
  {
    key: "pullTypeHarvester",
    name: "Pull Type Harvester",
    labelKey: "subcategories.traktorNested.grainHarvester.pullTypeHarvester",
    icon: ICONS.grain20(),
    href: "/farm-equipment/harvester/pull-type",
  },
];

const TractorNestedSub: TraktorSubCategoryItem[] = [
  ...TractorForSaleNestedSub,
  ...FarmToolsNestedSub,
  ...FertilizerSpreaderNestedSub,
  ...GrainHarvesterNestedSub,
];

export const traktorNestedMap = {
  top: TraktorTopCategories,
  tractorForSale: TractorForSaleNestedSub,
  farmTools: FarmToolsNestedSub,
  fertilizerSpreader: FertilizerSpreaderNestedSub,
  grainHarvester: GrainHarvesterNestedSub,
  all: TractorNestedSub,
};

export const categories = {
  BoatsForSaleNestedSub,
  BoatsForRentNestedSub,
  BoatEnginesNestedSub,
  BoatPartsNestedSub,
  carsNestedData,
  carsSubCategories,
  BusSubLinks: carsNestedData.BusSubLinks,
  TrailerNestedSub: carsNestedData.TrailerNestedSub,
  TruckNestedSub: carsNestedData.TruckNestedSub,
  jobMainCategoriesSo,
  FullTimeJobsNestedSub,
  PartTimeJobsNestedSub,
  FreelanceGigsNestedSub,
  experienceLevels,
  educationLevels,
  applicationMethods,
  AntiquesAndArtNestedSub,
  ElectronicsNestedSub,
  AnimalAndSuppliesNestedSub,
  SportsAndOutdoorsNestedSub,
  FurnitureNestedSub,
  FashionNestedSub,
  MotorcyclesForNestedSub,
  MotorcycleRentNestedSub,
  MCPartsNestedSub,
  OtherNestedSub,
  RealEstateForRentNestedSub,
  RealEstateForSaleNestedSub,
  RealEstateLandForSaleNestedSub,
  RealEstateFarmForSaleNestedSub,
  RealEstateCommercialNestedSub,
  TraktorTopCategories,
  TractorForSaleNestedSub,
  FarmToolsNestedSub,
  FertilizerSpreaderNestedSub,
  GrainHarvesterNestedSub,
  TractorNestedSub,
  boatsNestedMap: {
    forSale: BoatsForSaleNestedSub,
    forRent: BoatsForRentNestedSub,
    engines: BoatEnginesNestedSub,
    parts: BoatPartsNestedSub,
  },
  marketplaceNestedMap: {
    antiques: AntiquesAndArtNestedSub,
    electronics: ElectronicsNestedSub,
    animalAndSupplies: AnimalAndSuppliesNestedSub,
    sportsAndOutdoors: SportsAndOutdoorsNestedSub,
    furniture: FurnitureNestedSub,
    fashion: FashionNestedSub,
  },
  motorcyclesNestedMap: {
    forSale: MotorcyclesForNestedSub,
    forRent: MotorcycleRentNestedSub,
    parts: MCPartsNestedSub,
    other: OtherNestedSub,
  },
  traktorNestedMap,
  carsNestedCategoriesMap: {
    CarsForSaleNestedSub: carsNestedData.CarsForSaleNestedSub,
    LeaseCarsNestedSub: carsNestedData.LeaseCarsNestedSub,
    BusSubLinks: carsNestedData.BusSubLinks,
    TrailerNestedSub: carsNestedData.TrailerNestedSub,
    CarPartsNestedSub: carsNestedData.CarPartsNestedSub,
    TruckNestedSub: carsNestedData.TruckNestedSub,
    ElectricCarsNestedSub: carsNestedData.ElectricCarsNestedSub,
  },
  jobsSubCategories: {
    fullTimeJobs: FullTimeJobsNestedSub,
    partTimeJobs: PartTimeJobsNestedSub,
    freelanceGigs: FreelanceGigsNestedSub,
  },
  categoryNestedMap: {
    forRent: RealEstateForRentNestedSub,
    forSale: RealEstateForSaleNestedSub,
    landForSale: RealEstateLandForSaleNestedSub,
    farmForSale: RealEstateFarmForSaleNestedSub,
    commercial: RealEstateCommercialNestedSub,
  },
};
