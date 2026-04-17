import { Suspense } from "react";
import { fetchAgencies } from "@/actions/categories/actionsAgency";
import { getGlobalSearchResults } from "@/actions/categories/getGlobalSearchResults";
import { loadMoreFeedItems } from "@/actions/categories/feedActions";
import Agencies from "@/app/(agencies)/agencies/page";
import HomeContent from "../Filters/HomeContent";
import FeedClient from "./FeedClient";

async function AgenciesSection() {
  const agencies = await fetchAgencies().catch(() => []);
  return <Agencies initialAgencies={agencies} />;
}

export default async function DataFeed({ query }: { query: string }) {
  if (query) {
    const results = await getGlobalSearchResults(query).catch(() => []);
    return (
      <HomeContent
        serverSearchResults={Array.isArray(results) ? results : []}
        query={query}
      />
    );
  }

  const initialItems = await loadMoreFeedItems(1);

  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <AgenciesSection />
      </Suspense>
      <FeedClient initialItems={initialItems} />
    </div>
  );
}
