import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const VEHICLE_CATEGORIES = [
  "car",
  "cars",
  "motor",
  "motors",
  "motorcycle",
  "motorcycles",
  "boat",
  "boats",
  "farm equipment",
  "farmequipment",
  "traktor",
  "traktors",
  "truck",
  "trucks",
  "bus",
  "buses",
  "van",
  "vans",
  "pickup",
  "pickups",
  "suv",
  "suvs",
  "vehicle",
  "vehicles",
];

const REAL_ESTATE_CATEGORIES = [
  "apartment",
  "apartments",
  "house",
  "houses",
  "land",
  "sale",
  "rent",
  "commercial property",
  "commercial",
  "real estate",
  "real-estate",
  "realestate",
  "villa",
  "villas",
];

const JOB_CATEGORIES = [
  "job",
  "jobs",
  "employment",
  "career",
  "vacancy",
  "vacancies",
];

export const CATEGORY_ROUTE_MAP = [
  { categories: VEHICLE_CATEGORIES, route: "/vehicles" },
  { categories: REAL_ESTATE_CATEGORIES, route: "/real-estate" },
  { categories: JOB_CATEGORIES, route: "/jobs" },
];

export function getDetailRoute(listing: UniversalCardProps): string {
  const raw = listing.category;
  const id = listing._id || listing.id;

  const candidates: string[] = Array.isArray(raw)
    ? raw.map((c) => String(c).toLowerCase())
    : typeof raw === "string"
      ? [raw.toLowerCase()]
      : [];

  for (const { categories, route } of CATEGORY_ROUTE_MAP) {
    if (candidates.some((c) => categories.includes(c))) {
      return `${route}/${id}`;
    }
  }
  return `/item-details/${id}`;
}
