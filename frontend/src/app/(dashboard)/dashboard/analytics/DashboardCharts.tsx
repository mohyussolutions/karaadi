import { getDashboardSummary, getDashboardGeo } from "@/actions/categories/getDashboardSummary";
import { LineChartBlock } from "./LineChartBlock";
import { BarChartBlock } from "./BarChartBlock";
import { RegionsAndCityCharts } from "./chars/RegionsAndCityCharts";

function fmtMonth(s: string) {
  const [y, m] = s.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("default", {
    month: "short",
  });
}

export default async function DashboardCharts() {
  const [data, geo] = await Promise.all([getDashboardSummary(), getDashboardGeo()]);
  const revenue = data.revenue.map((d) => ({ ...d, month: fmtMonth(d.month) }));
  const signups = data.signups.map((d) => ({ ...d, month: fmtMonth(d.month) }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[220px]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden min-h-[220px]">
          <LineChartBlock
            title="Revenue by Month"
            subtitle="All time"
            data={revenue}
            dataKey="revenue"
            stroke="#6366f1"
            isCurrency
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden min-h-[220px]">
          <BarChartBlock
            title="User Signups by Month"
            subtitle="All time"
            data={signups}
            dataKey="users"
            barColor="#0ea5e9"
            secondaryDataKey="totalUsers"
            secondaryLabel="Total Users"
            secondaryColor="#f59e0b"
          />
        </div>
      </div>

      <RegionsAndCityCharts
        regionData={geo.regionListings}
        cityData={geo.cityListings}
      />
    </>
  );
}
