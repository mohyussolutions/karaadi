"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { regions, cities } from "./regions.and.cities";
import { StatsCards } from "./analytics/StatsCards";
import { DashboardChartBlock } from "./analytics/chars/DashboardChartBlock";
import { RegionsAndCityCharts } from "./analytics/chars/RegionsAndCityCharts";
import CategoryTotals from "./analytics/CategoryTotals";
import AdminNavigationLinks from "@/app/(links)/dashboardLinks/AdminNavigationLinks";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const [regionData, setRegionData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);

  useEffect(() => {
    const generatedRegions = regions.map((r) => ({
      name: r.name,
      buyers: Math.floor(Math.random() * 500) + 50,
    }));

    const generatedCities = cities
      .map((c) => ({
        name: c.name,
        buyers: Math.floor(Math.random() * 500) + 50,
      }))
      .sort((a, b) => b.buyers - a.buyers)
      .slice(0, 8);

    setRegionData(generatedRegions);
    setCityData(generatedCities);
  }, []);

  if (isLoading || !user) return null;

  return (
    <div className="flex flex-col gap-6 p-4">
      <AdminNavigationLinks user={user} />
      <CategoryTotals />
      <StatsCards />
      <DashboardChartBlock />
      <RegionsAndCityCharts regionData={regionData} cityData={cityData} />
    </div>
  );
}
