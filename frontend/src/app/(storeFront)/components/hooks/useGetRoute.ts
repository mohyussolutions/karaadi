"use client";
import { LinksDetails } from "@/app/(links)/dashboardLinks/chat-links";
export const useGetRoute = (item?: { category?: string }) => {
  switch (item?.category) {
    case "real-estate":
      return LinksDetails.realEstate;
    case "vehicles":
      return LinksDetails.vehicles;
    default:
      return LinksDetails.itemDetails;
  }
};
