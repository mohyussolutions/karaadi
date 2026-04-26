import { Suspense } from "react";
import { getDashboardSummary } from "@/actions/categories/getDashboardSummary";
import CategoryTotals from "./analytics/CategoryTotals";
import { StatsCards } from "./analytics/StatsCards";
import DashboardCharts from "./analytics/DashboardCharts";
import {
  CirclesSkeleton,
  StatsSkeleton,
  ChartsSkeleton,
} from "./analytics/DashboardSkeletons";

async function CategoryTotalsSection() {
  const data = await getDashboardSummary();
  return <CategoryTotals totals={data.categoryTotals} />;
}

async function StatsSection() {
  const data = await getDashboardSummary();
  return <StatsCards stats={data.stats} />;
}

export default function DashboardPage() {
  return (
    <div className="px-2 sm:px-4 my-4 sm:my-8 flex flex-col gap-4 sm:gap-6">
      <Suspense fallback={<CirclesSkeleton />}>
        <CategoryTotalsSection />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <DashboardCharts />
      </Suspense>
    </div>
  );
}
