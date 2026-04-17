"use server";

import { getCars } from "./carActions";
import { getBoats } from "./boatActions";
import { getJobs } from "./jobActions";
import { getMarketplaceItems } from "./marketplaceActions";
import { getMotorcycles } from "./motorcycleActions";
import { getRealEstateListings } from "./realEstateActions";
import { getFarmequipment } from "./FarmequipmentAction";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const PAGE_SIZE = 10;

function priorityRank(item: UniversalCardProps): number {
  if (item.isPremium90) return 0;
  if (item.isStandard60) return 1;
  if (item.isBasic30) return 2;
  return 3;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function sortByPriority(items: UniversalCardProps[]): UniversalCardProps[] {
  const b: [UniversalCardProps[], UniversalCardProps[], UniversalCardProps[], UniversalCardProps[]] = [[], [], [], []];
  for (const item of items) b[priorityRank(item)].push(item);
  return [...shuffle(b[0]), ...shuffle(b[1]), ...shuffle(b[2]), ...shuffle(b[3])];
}

function normalizeItems(raw: any[], category: string): UniversalCardProps[] {
  if (!Array.isArray(raw) || !raw.length) return [];
  return raw.map((item) => {
    const itemId = item.id || item._id;
    const images =
      Array.isArray(item.images) && item.images.length ? item.images
      : item.image ? [item.image]
      : item.companyLogo ? [item.companyLogo]
      : item.logo ? [item.logo]
      : [];
    return {
      id: itemId,
      _id: itemId,
      title: item.title || item.name || "",
      price: item.price,
      city: item.city || item.region || "",
      images,
      description: item.description || "",
      category: typeof item.category === "string" && item.category ? item.category : category,
      subcategory: item.subcategory,
      maGaday: !!item.maGaday,
      isBasic30: !!item.isBasic30,
      isStandard60: !!item.isStandard60,
      isPremium90: !!item.isPremium90,
      type: item.type || item.vehicleModel || "",
    };
  });
}

export async function loadMoreFeedItems(page: number): Promise<UniversalCardProps[]> {
  const [carsRaw, boatsRaw, jobsRaw, marketRaw, motorRaw, realRaw, farmRaw] =
    await Promise.all([
      getCars(page, PAGE_SIZE).catch(() => []),
      getBoats(page, PAGE_SIZE).catch(() => []),
      getJobs(page, PAGE_SIZE).catch(() => []),
      getMarketplaceItems(page, PAGE_SIZE).catch(() => []),
      getMotorcycles(page, PAGE_SIZE).catch(() => []),
      getRealEstateListings(page, PAGE_SIZE).catch(() => []),
      getFarmequipment(page, PAGE_SIZE).catch(() => []),
    ]);

  return sortByPriority([
    ...normalizeItems(carsRaw, "cars"),
    ...normalizeItems(boatsRaw ?? [], "boats"),
    ...normalizeItems(jobsRaw, "jobs"),
    ...normalizeItems(marketRaw ?? [], "marketplace"),
    ...normalizeItems(motorRaw, "motorcycles"),
    ...normalizeItems(realRaw, "real-estate"),
    ...normalizeItems(farmRaw, "traktor"),
  ]);
}
