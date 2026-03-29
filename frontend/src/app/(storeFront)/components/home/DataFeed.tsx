import { fetchAgencies } from "@/actions/categories/actionsAgency";
import { getBoats } from "@/actions/categories/boatActions";
import { getCars } from "@/actions/categories/carActions";
import { getJobs } from "@/actions/categories/jobActions";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { getAllFarmEquipment } from "@/actions/categories/FarmequipmentAction";
import { getAllSubscriptionPaid } from "@/actions/categories/subscriptionsActions";
import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import HomeContent from "../Filters/HomeContent";
import Agencies from "@/app/(agencies)/agencies/page";
import { FeedItem } from "@/app/utils/types/feed";

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

async function safeFetch<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  timeoutMs = 3000,
): Promise<T> {
  const timeout = new Promise<T>((resolve) =>
    setTimeout(() => resolve(fallback), timeoutMs),
  );

  try {
    return await Promise.race([fetcher(), timeout]);
  } catch {
    return fallback;
  }
}

export async function DataFeed({ query }: { query: string }) {
  const [
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
    query ? safeFetch(() => getGlobalSearchResults(query), null) : null,
    safeFetch(() => getBoats(), null),
    safeFetch(() => getCars(), null),
    safeFetch(() => getJobs(), null),
    safeFetch(() => getMarketplaceItems(), null),
    safeFetch(() => getMotorcycles(), null),
    safeFetch(() => getRealEstateListings(), null),
    safeFetch(() => getAllFarmEquipment(), null),
    safeFetch(() => getAllSubscriptionPaid(), null),
    safeFetch(() => fetchAgencies(), []),
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

  const searchResults = mapToFeedItem(searchResultsRaw as any[]);

  return (
    <HomeContent
      key={query}
      initialData={initialData}
      userId={null}
      serverSearchResults={searchResults}
      isSearching={!!query}
    >
      <Agencies initialAgencies={agencies} />
    </HomeContent>
  );
}
