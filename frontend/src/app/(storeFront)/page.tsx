import { Suspense } from "react";
import CategoryLinks from "./components/navbar/MainCategoryLinks";
import { DataFeed } from "./components/home/DataFeed";
import { HomeSkeleton } from "./components/home/HomeSkeleton";
export default function Home() {
  return (
    <div className="space-y-8 py-6 px-2">
      <CategoryLinks />
      <Suspense fallback={<HomeSkeleton />}>
        <DataFeed />
      </Suspense>
    </div>
  );
}
