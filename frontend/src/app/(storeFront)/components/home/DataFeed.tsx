import { Suspense } from "react";
import { fetchAgencies } from "@/actions/categories/actionsAgency";
import { loadFeedPage } from "@/actions/categories/feedActions";
import AgenciesCarousel from "@/app/(agencies)/agencies/AgenciesCarousel";
import FeedClient from "./FeedClient";

async function AgenciesSection() {
  const agencies = await fetchAgencies().catch(() => []);
  if (!agencies.length) return null;
  return <AgenciesCarousel initialAgencies={agencies} />;
}

async function Feed() {
  const items = await loadFeedPage(1);
  return <FeedClient initialItems={items} />;
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-[4/3] rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

export default function DataFeed() {
  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <AgenciesSection />
      </Suspense>
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  );
}
