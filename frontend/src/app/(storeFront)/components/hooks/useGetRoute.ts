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
  vehicles: "vehicles",
  car: "vehicles",
  cars: "vehicles",
  motorcycle: "vehicles",
  motorcycles: "vehicles",
  boat: "vehicles",
  boats: "vehicles",
  truck: "vehicles",
  trucks: "vehicles",
  van: "vehicles",
  vans: "vehicles",
  bus: "vehicles",
  buses: "vehicles",
  tractor: "vehicles",
  tractors: "vehicles",
  "farm equipment": "vehicles",

  "real-estate": "real-estate",
  realestate: "real-estate",
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

  job: "jobs",
  jobs: "jobs",
  career: "jobs",
  careers: "jobs",
  vacancy: "jobs",
  vacancies: "jobs",
  hiring: "jobs",
};

export const getCategoryRoute = (type?: string): string => {
  const key = type?.toLowerCase() || "";
  return ROUTE_MAP[key] || LinksDetails.itemDetails;
};

export const useGetRoute = () => {
  const getRoute = (category?: string | string[]) => {
    const key = Array.isArray(category)
      ? category[0]?.toLowerCase()
      : category?.toLowerCase() || "";

    const route = ROUTE_MAP[key] || LinksDetails.itemDetails;
    return route.startsWith("/") ? route : `/${route}`;
  };

  return { getRoute };
};
