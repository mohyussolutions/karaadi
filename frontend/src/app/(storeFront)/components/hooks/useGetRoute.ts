"use client";

export const LinksDetails = {
  itemDetails: "item-details",
  realEstate: "real-estate",
  vehicles: "vehicles",
  jobs: "jobs",
};

export const REAL_ESTATE_DETAILS = "/real-estate";
export const VEHICLES_DETAILS = "/vehicles";
export const JOBS_DETAILS = "/jobs";
export const ITEM_DETAILS = "/item-details";

export const ROUTE_MAP: Record<string, string> = {
  // ── vehicles (all source & category names) ───────────────────────────────
  vehicles: "vehicles",
  vehicle: "vehicles",
  car: "vehicles/cars",
  cars: "vehicles/cars",
  Gawaari: "vehicles/cars",
  gawaari: "vehicles/cars",
  motorcycle: "vehicles/motorcycles",
  motorcycles: "vehicles/motorcycles",
  Motorcycle: "vehicles/motorcycles",
  boat: "vehicles/boats",
  boats: "vehicles/boats",
  Boats: "vehicles/boats",
  truck: "vehicles",
  trucks: "vehicles",
  van: "vehicles",
  vans: "vehicles",
  bus: "vehicles",
  buses: "vehicles",
  tractor: "vehicles/Farmequipment",
  tractors: "vehicles/Farmequipment",
  "farm equipment": "vehicles/Farmequipment",
  farmequipment: "vehicles/Farmequipment",
  traktor: "vehicles/Farmequipment",
  farmEquipment: "vehicles/Farmequipment",
  FarmEquipment: "vehicles/Farmequipment",
  Equipment: "vehicles/Farmequipment",
  equipment: "vehicles/Farmequipment",

  // ── real estate ──────────────────────────────────────────────────────────
  "real-estate": "real-estate",
  realestate: "real-estate",
  RealEstate: "real-estate",   // PascalCase source name
  apartment: "real-estate",
  apartments: "real-estate",
  house: "real-estate",
  houses: "real-estate",
  land: "real-estate",
  villa: "real-estate",
  villas: "real-estate",
  office: "real-estate",
  commercial: "real-estate",
  property: "real-estate",

  // ── jobs ─────────────────────────────────────────────────────────────────
  job: "jobs",
  jobs: "jobs",
  Job: "jobs",
  Jobs: "jobs",
  career: "jobs",
  careers: "jobs",
  vacancy: "jobs",
  vacancies: "jobs",
  hiring: "jobs",

  // ── marketplace (item-details) ───────────────────────────────────────────
  marketplace: "item-details",
  Marketplace: "item-details",
  alaabooyin: "item-details",
};

export const getCategoryRoute = (type?: string): string => {
  if (!type) return LinksDetails.itemDetails;
  return ROUTE_MAP[type] || ROUTE_MAP[type.toLowerCase()] || LinksDetails.itemDetails;
};

export const useGetRoute = () => {
  const getRoute = (category?: string | string[]) => {
    const key = Array.isArray(category) ? category[0] : (category || "");
    const route =
      ROUTE_MAP[key] ||
      ROUTE_MAP[key.toLowerCase()] ||
      LinksDetails.itemDetails;
    return route.startsWith("/") ? route : `/${route}`;
  };

  return { getRoute };
};
