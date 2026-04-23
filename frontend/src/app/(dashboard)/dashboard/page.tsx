import { Suspense } from "react";
import CategoryTotals from "./total/CategoryTotals";
import DashboardCharts from "./analytics/DashboardCharts";
import {
  CirclesSkeleton,
  StatsSkeleton,
  ChartsSkeleton,
} from "./analytics/DashboardSkeletons";
import StatsGrid from "./subtotal/StatsGrid";

export default function DashboardPage() {
  return (
    <div className="px-2 sm:px-4 my-4 sm:my-8 flex flex-col gap-4 sm:gap-6">
      <Suspense fallback={<CirclesSkeleton />}>
        <CategoryTotals />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsGrid />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <DashboardCharts />
      </Suspense>
    </div>
  );
}
