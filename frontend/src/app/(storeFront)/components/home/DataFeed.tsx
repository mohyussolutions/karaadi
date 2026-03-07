"use server";

import { fetchAgencies } from "@/actions/categories/actionsAgency";
import { getBoats } from "@/actions/categories/boatActions";
import { getCars } from "@/actions/categories/carActions";
import { getJobs } from "@/actions/categories/jobActions";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { getAllFarmEquipment } from "@/actions/categories/FarmequipmentAction";
import { getAllSubscriptionPaid } from "@/actions/categories/subscriptionsActions";
import { verifySession } from "@/actions/core/authAction";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import HomeContent from "../Filters/HomeContent";
import Agencies from "@/app/(agencies)/agencies/page";
import { FeedItem } from "../hooks/useRandomFeed";

export interface InitialData {
  boats: FeedItem[] | null;
  cars: FeedItem[] | null;
  jobs: FeedItem[] | null;
  marketplace: FeedItem[] | null;
  motorcycles: FeedItem[] | null;
  realEstate: FeedItem[] | null;
  farmequipment: FeedItem[] | null;
  subscriptions: FeedItem[] | null;
  [key: string]: FeedItem[] | null;
}

const mapToFeedItem = (items: any[] | null): FeedItem[] | null => {
  if (!items) return null;
  return items.map((item) => ({
    ...item,
    id: item.id || item._id,
  }));
};

async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

export async function DataFeed({ query }: { query: string }) {
  const [
    user,
    searchResultsRaw,
    boatsRaw,
    carsRaw,
    jobsRaw,
    marketplaceRaw,
    motorcyclesRaw,
    realEstateRaw,
    farmRaw,
    subscriptionsRaw,
    agencies,
  ] = await Promise.all([
    verifySession(),
    query ? fetchWithFallback(() => getGlobalSearchResults(query), null) : null,
    fetchWithFallback(() => getBoats(), null),
    fetchWithFallback(() => getCars(), null),
    fetchWithFallback(() => getJobs(), null),
    fetchWithFallback(() => getMarketplaceItems(), null),
    fetchWithFallback(() => getMotorcycles(), null),
    fetchWithFallback(() => getRealEstateListings(), null),
    fetchWithFallback(() => getAllFarmEquipment(), null),
    fetchWithFallback(() => getAllSubscriptionPaid(), null),
    fetchWithFallback(() => fetchAgencies(), []),
  ]);

  const initialData: InitialData = {
    boats: mapToFeedItem(boatsRaw),
    cars: mapToFeedItem(carsRaw),
    jobs: mapToFeedItem(jobsRaw),
    marketplace: mapToFeedItem(marketplaceRaw),
    motorcycles: mapToFeedItem(motorcyclesRaw),
    realEstate: mapToFeedItem(realEstateRaw),
    farmequipment: mapToFeedItem(farmRaw),
    subscriptions: mapToFeedItem(subscriptionsRaw),
  };

  const searchResults = mapToFeedItem(searchResultsRaw as any[] | null);

  return (
    <HomeContent
      initialData={initialData}
      userId={user?._id || null}
      serverSearchResults={searchResults}
      isSearching={!!query}
    >
      <Agencies initialAgencies={agencies} />
    </HomeContent>
  );
}
