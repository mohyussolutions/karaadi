import { Suspense } from "react";
import CategoryTotals from "./analytics/CategoryTotals";
import { StatsCards } from "./analytics/StatsCards";
import DashboardChartBlock from "./analytics/chars/DashboardChartBlock";
import RegionChartsLoader from "./analytics/chars/RegionChartsLoader";
import {
  CircleSkeleton,
  StatCardSkeleton,
  CardSkeleton,
} from "./components/loading";

const CategoryFallback = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center py-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <CircleSkeleton key={i} />
    ))}
  </div>
);

const StatsFallback = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full px-2 py-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

const ChartFallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <CardSkeleton className="min-h-[300px]" />
    <CardSkeleton className="min-h-[300px]" />
  </div>
);

const BarFallback = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
    <CardSkeleton className="min-h-[350px]" />
    <CardSkeleton className="min-h-[350px]" />
  </div>
);

export default function DashboardSummary() {
  return (
    <div className="mx-6 my-8 flex flex-col gap-6">
      <Suspense fallback={<CategoryFallback />}>
        <CategoryTotals />
      </Suspense>
      <Suspense fallback={<StatsFallback />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<ChartFallback />}>
        <DashboardChartBlock />
      </Suspense>
      <Suspense fallback={<BarFallback />}>
        <RegionChartsLoader />
      </Suspense>
    </div>
  );
}
