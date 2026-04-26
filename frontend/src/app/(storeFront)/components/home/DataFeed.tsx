import { Suspense } from "react";
import { loadFeedPage } from "@/actions/categories/feedActions";
import FeedClient from "./FeedClient";

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
    <Suspense fallback={<FeedSkeleton />}>
      <Feed />
    </Suspense>
  );
}
