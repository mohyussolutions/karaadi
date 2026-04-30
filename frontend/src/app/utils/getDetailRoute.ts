import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const MAIN_CATEGORY_ROUTE: Record<string, (id: string) => string> = {
  Gawaari:   (id) => `/vehicles/cars/${id}`,
  Boats:     (id) => `/vehicles/boats/${id}`,
  Motorcycle: (id) => `/vehicles/motorcycles/${id}`,
  Equipment: (id) => `/vehicles/Farmequipment/${id}`,
  RealEstate: (id) => `/real-estate/${id}`,
  Marketplace: (id) => `/item-details/${id}`,
  Jobs:      (id) => `/jobs/${id}`,
};

const CATEGORY_ROUTE: Record<string, (id: string) => string> = {
  car:            (id) => `/vehicles/cars/${id}`,
  cars:           (id) => `/vehicles/cars/${id}`,
  gawaari:        (id) => `/vehicles/cars/${id}`,
  boat:           (id) => `/vehicles/boats/${id}`,
  boats:          (id) => `/vehicles/boats/${id}`,
  motorcycle:     (id) => `/vehicles/motorcycles/${id}`,
  motorcycles:    (id) => `/vehicles/motorcycles/${id}`,
  motor:          (id) => `/vehicles/motorcycles/${id}`,
  "farm equipment": (id) => `/vehicles/Farmequipment/${id}`,
  farmequipment:  (id) => `/vehicles/Farmequipment/${id}`,
  equipment:      (id) => `/vehicles/Farmequipment/${id}`,
  traktor:        (id) => `/vehicles/Farmequipment/${id}`,
  traktors:       (id) => `/vehicles/Farmequipment/${id}`,
  "real estate":  (id) => `/real-estate/${id}`,
  "real-estate":  (id) => `/real-estate/${id}`,
  realestate:     (id) => `/real-estate/${id}`,
  apartment:      (id) => `/real-estate/${id}`,
  house:          (id) => `/real-estate/${id}`,
  land:           (id) => `/real-estate/${id}`,
  villa:          (id) => `/real-estate/${id}`,
  iib:            (id) => `/real-estate/${id}`,
  kirada:         (id) => `/real-estate/${id}`,
  job:            (id) => `/jobs/${id}`,
  jobs:           (id) => `/jobs/${id}`,
  marketplace:    (id) => `/item-details/${id}`,
};

export const CATEGORY_ROUTE_MAP = [
  { categories: ["car","cars","gawaari","boat","boats","motorcycle","motorcycles","motor","farm equipment","farmequipment","equipment","traktor","traktors"], route: "/vehicles" },
  { categories: ["real estate","real-estate","realestate","apartment","house","land","villa","iib","kirada"], route: "/real-estate" },
  { categories: ["job","jobs"], route: "/jobs" },
];

export function getDetailRoute(listing: UniversalCardProps): string {
  const id = String(listing._id ?? listing.id ?? "");
  if (!id) return "/";

  const mainCat = listing.mainCategory;
  if (mainCat && MAIN_CATEGORY_ROUTE[mainCat]) {
    return MAIN_CATEGORY_ROUTE[mainCat](id);
  }

  const raw = listing.category;
  const candidates: string[] = Array.isArray(raw)
    ? raw.map((c) => String(c).toLowerCase())
    : typeof raw === "string" && raw
      ? [raw.toLowerCase()]
      : [];

  for (const candidate of candidates) {
    const routeFn = CATEGORY_ROUTE[candidate];
    if (routeFn) return routeFn(id);
  }

  return `/item-details/${id}`;
}
