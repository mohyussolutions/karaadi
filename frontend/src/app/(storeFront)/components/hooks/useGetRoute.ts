"use client";

import { LinksDetails } from "@/app/(links)/dashboardLinks/chat-links";

const ROUTE_MAP: Record<string, string> = {
  "real-estate": LinksDetails.realEstate,
  jobs: LinksDetails.jobs,
  marketplace: LinksDetails.itemDetails,
  cars: LinksDetails.vehicles,
  motorcycles: LinksDetails.vehicles,
  boats: LinksDetails.vehicles,
  farmequipment: LinksDetails.vehicles,
  vehicles: LinksDetails.vehicles,
};

export const useGetRoute = (item?: { category?: any }) => {
  const cat = item?.category;

  const category =
    typeof cat === "string"
      ? cat.toLowerCase()
      : Array.isArray(cat)
        ? cat[0]?.toLowerCase()
        : "";

  return ROUTE_MAP[category] || LinksDetails.itemDetails;
};
