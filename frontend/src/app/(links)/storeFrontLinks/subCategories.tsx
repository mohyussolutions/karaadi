import { CategoryIcons } from "@/app/utils/icons/subCategoryIcons";
import {
  CategoryOption,
  JobQuickLink,
} from "@/app/utils/types/nesSubCategoryTypes";

export const marketplaceSubCategories: CategoryOption[] = [
  {
    key: "antiques",
    name: "Antiques & Art",
    labelKey: "subcategories.marketplace.antiques",
    icon: <CategoryIcons.Antiques />,
    href: "/Marketplace/antiques-and-art",
  },
  {
    key: "electronics",
    name: "Electronics",
    labelKey: "subcategories.marketplace.electronics",
    icon: <CategoryIcons.Electronics />,
    href: "/Marketplace/electronics",
  },
  {
    key: "animalAndSupplies",
    name: "Animal & Supplies",
    labelKey: "subcategories.marketplace.animalAndSupplies",
    icon: <CategoryIcons.Animals />,
    href: "/Marketplace/animal-and-supplies",
  },
  {
    key: "sportsAndOutdoors",
    name: "Sports & Outdoors",
    labelKey: "subcategories.marketplace.sportsAndOutdoors",
    icon: <CategoryIcons.Sports />,
    href: "/Marketplace/sports-and-outdoors",
  },
  {
    key: "furniture",
    name: "Furniture & Interior",
    labelKey: "subcategories.marketplace.furniture",
    icon: <CategoryIcons.Furniture />,
    href: "/Marketplace/furniture-and-interior",
  },
  {
    key: "fashion",
    name: "Fashion & Accessories",
    labelKey: "subcategories.marketplace.fashion",
    icon: <CategoryIcons.Fashion />,
    href: "/Marketplace/fashion-and-accessories",
  },
];

export const realEstateSubCategories: CategoryOption[] = [
  {
    key: "forRent",
    name: "For Rent",
    labelKey: "subcategories.realEstate.forRent",
    icon: <CategoryIcons.Rent />,
    href: "/real-estate/for-rent",
  },
  {
    key: "forSale",
    name: "For Sale",
    labelKey: "subcategories.realEstate.forSale",
    icon: <CategoryIcons.Sale />,
    href: "/real-estate/for-sale",
  },
  {
    key: "landForSale",
    name: "Land For Sale",
    labelKey: "subcategories.realEstate.landForSale",
    icon: <CategoryIcons.Land />,
    href: "/real-estate/land-for-sale",
  },
  {
    key: "farmForSale",
    name: "Farm For Sale",
    labelKey: "subcategories.realEstate.farmForSale",
    icon: <CategoryIcons.Farm />,
    href: "/real-estate/farm-for-sale",
  },
  {
    key: "commercial",
    name: "Commercial",
    labelKey: "subcategories.realEstate.commercial",
    icon: <CategoryIcons.Commercial />,
    href: "/real-estate/commercial",
  },
];

export const vehicleSubCategories: CategoryOption[] = [
  {
    key: "carsForSale",
    name: "Cars For Sale",
    labelKey: "subcategories.vehicles.carsForSale",
    icon: <CategoryIcons.CarSale />,
    href: "/cars/cars-for-sale",
  },
  {
    key: "leaseCars",
    name: "Lease Cars",
    labelKey: "subcategories.vehicles.leaseCars",
    icon: <CategoryIcons.CarLease />,
    href: "/cars/lease-cars",
  },
  {
    key: "trailers",
    name: "Trailers",
    labelKey: "subcategories.vehicles.trailers",
    icon: <CategoryIcons.Trailer />,
    href: "/cars/trailers",
  },
  {
    key: "carParts",
    name: "Car Parts",
    labelKey: "subcategories.vehicles.carParts",
    icon: <CategoryIcons.Parts />,
    href: "/cars/car-parts",
  },
  {
    key: "truck",
    name: "Truck",
    labelKey: "subcategories.vehicles.truck",
    icon: <CategoryIcons.Truck />,
    href: "/cars/truck",
  },
  {
    key: "electricCars",
    name: "Electric Cars",
    labelKey: "subcategories.vehicles.electricCars",
    icon: <CategoryIcons.Electric />,
    href: "/cars/electric-cars",
  },
  {
    key: "buses",
    name: "Buses",
    labelKey: "subcategories.vehicles.buses",
    icon: <CategoryIcons.Bus />,
    href: "/cars/buses",
  },
];

export const motorcycleSubCategories: CategoryOption[] = [
  {
    key: "forSale",
    name: "For Sale",
    labelKey: "subcategories.motorcycles.forSale",
    icon: <CategoryIcons.MotorcycleSale />,
    href: "/motorcycles/for-sale",
  },
  {
    key: "forRent",
    name: "For Rent",
    labelKey: "subcategories.motorcycles.forRent",
    icon: <CategoryIcons.MotorcycleRent />,
    href: "/motorcycles/for-rent",
  },
  {
    key: "spareParts",
    name: "Spare Parts",
    labelKey: "subcategories.motorcycles.spareParts",
    icon: <CategoryIcons.SpareParts />,
    href: "/motorcycles/spare-parts",
  },
  {
    key: "other",
    name: "Other",
    labelKey: "subcategories.motorcycles.other",
    icon: <CategoryIcons.OtherMotorcycle />,
    href: "/motorcycles/other",
  },
];

export const boatSubCategories: CategoryOption[] = [
  {
    key: "boatsForSale",
    name: "Boats For Sale",
    labelKey: "subcategories.boats.boatsForSale",
    icon: <CategoryIcons.BoatSale />,
    href: "/boats/boats-for-sale",
  },
  {
    key: "boatsForRent",
    name: "Boats For Rent",
    labelKey: "subcategories.boats.boatsForRent",
    icon: <CategoryIcons.BoatRent />,
    href: "/boats/boats-for-rent",
  },
  {
    key: "boatEnginesForSale",
    name: "Boat Engines For Sale",
    labelKey: "subcategories.boats.boatEnginesForSale",
    icon: <CategoryIcons.BoatEngine />,
    href: "/boats/boat-engines-for-sale",
  },
  {
    key: "boatParts",
    name: "Boat Parts",
    labelKey: "subcategories.boats.boatParts",
    icon: <CategoryIcons.BoatParts />,
    href: "/boats/boat-parts",
  },
];

export const farmEquipmentSubCategories: CategoryOption[] = [
  {
    key: "tractor",
    name: "Tractor",
    labelKey: "subcategories.farmEquipment.tractor",
    icon: <CategoryIcons.Tractor />,
    href: "/farmequipment/tractor-for-sale",
  },
  {
    key: "tools",
    name: "Farm Tools",
    labelKey: "subcategories.farmEquipment.tools",
    icon: <CategoryIcons.FarmTools />,
    href: "/farmequipment/farm-tools",
  },
  {
    key: "fertilizerSpreader",
    name: "Fertilizer Spreader",
    labelKey: "subcategories.farmEquipment.fertilizerSpreader",
    icon: <CategoryIcons.FertilizerSpreader />,
    href: "/farmequipment/fertilizer-spreader",
  },
  {
    key: "harvester",
    name: "Grain Harvester",
    labelKey: "subcategories.farmEquipment.harvester",
    icon: <CategoryIcons.Harvester />,
    href: "/farmequipment/grain-harvester",
  },
  {
    key: "plow",
    name: "Plow",
    labelKey: "subcategories.farmEquipment.plow",
    icon: <CategoryIcons.Plow />,
    href: "/farmequipment/plow",
  },
  {
    key: "irrigation",
    name: "Irrigation System",
    labelKey: "subcategories.farmEquipment.irrigation",
    icon: <CategoryIcons.Irrigation />,
    href: "/farmequipment/irrigation-system",
  },
];

export const jobSubCategories: CategoryOption[] = [
  {
    key: "fullTime",
    name: "Full Time",
    labelKey: "subcategories.jobs.fullTime",
    icon: <CategoryIcons.FullTime />,
    href: "/jobs/full-time",
  },
  {
    key: "partTime",
    name: "Part Time",
    labelKey: "subcategories.jobs.partTime",
    icon: <CategoryIcons.PartTime />,
    href: "/jobs/part-time",
  },
  {
    key: "physical",
    name: "Physical Labor",
    labelKey: "subcategories.jobs.physical",
    icon: <CategoryIcons.Physical />,
    href: "/jobs/physical",
  },
  {
    key: "internship",
    name: "Internship",
    labelKey: "subcategories.jobs.internship",
    icon: <CategoryIcons.Internship />,
    href: "/jobs/internship",
  },
  {
    key: "remote",
    name: "Remote",
    labelKey: "subcategories.jobs.remote",
    icon: <CategoryIcons.Remote />,
    href: "/jobs/remote",
  },
  {
    key: "tech",
    name: "Technology",
    labelKey: "subcategories.jobs.tech",
    icon: <CategoryIcons.Tech />,
    href: "/jobs/tech",
  },
  {
    key: "finance",
    name: "Finance",
    labelKey: "subcategories.jobs.finance",
    icon: <CategoryIcons.Finance />,
    href: "/jobs/finance",
  },
  {
    key: "education",
    name: "Education",
    labelKey: "subcategories.jobs.education",
    icon: <CategoryIcons.Education />,
    href: "/jobs/education",
  },
  {
    key: "healthcare",
    name: "Healthcare",
    labelKey: "subcategories.jobs.healthcare",
    icon: <CategoryIcons.Healthcare />,
    href: "/jobs/healthcare",
  },
  {
    key: "hospitality",
    name: "Hospitality",
    labelKey: "subcategories.jobs.hospitality",
    icon: <CategoryIcons.Hospitality />,
    href: "/jobs/hospitality",
  },
];

export const jobQuickLinks: JobQuickLink[] = [
  {
    key: "it",
    name: "IT",
    labelKey: "quicklinks.jobs.it",
    icon: <CategoryIcons.IT />,
    href: "/jobs/it",
  },
  {
    key: "airport",
    name: "Airport",
    labelKey: "quicklinks.jobs.airport",
    icon: <CategoryIcons.Airport />,
    href: "/jobs/airports",
  },
  {
    key: "public",
    name: "Public",
    labelKey: "quicklinks.jobs.public",
    icon: <CategoryIcons.Public />,
    href: "/jobs/public",
  },
  {
    key: "seaport",
    name: "Seaport",
    labelKey: "quicklinks.jobs.seaport",
    icon: <CategoryIcons.Seaport />,
    href: "/jobs/seaport",
  },
  {
    key: "construction",
    name: "Construction",
    labelKey: "quicklinks.jobs.construction",
    icon: <CategoryIcons.Construction />,
    href: "/jobs/construction",
  },
  {
    key: "agriculture",
    name: "Agriculture",
    labelKey: "quicklinks.jobs.agriculture",
    icon: <CategoryIcons.Agriculture />,
    href: "/jobs/agriculture",
  },
  {
    key: "transportation",
    name: "Transportation",
    labelKey: "quicklinks.jobs.transportation",
    icon: <CategoryIcons.Transportation />,
    href: "/jobs/transportation",
  },
];
