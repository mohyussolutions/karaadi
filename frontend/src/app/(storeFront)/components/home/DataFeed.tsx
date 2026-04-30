import { Suspense } from "react";
import { loadFeedPage } from "@/actions/categories/feedActions";
import { getDetailRoute } from "@/app/utils/getDetailRoute";
import FeedClientWrapper from "./FeedClientWrapper";

async function Feed() {
  const raw = await loadFeedPage(1);
  const items = raw.map((item) => ({
    ...item,
    linkHref: getDetailRoute(item),
  }));
  return <FeedClientWrapper initialItems={items} />;
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
    <Suspense fallback={<FeedSkeleton />}>
      <Feed />
    </Suspense>
  );
}
