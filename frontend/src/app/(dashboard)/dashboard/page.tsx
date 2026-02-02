"use client";

import React, { useEffect, useState } from "react";
import { StatsCards } from "./analytics/StatsCards";
import { DashboardChartBlock } from "./analytics/chars/DashboardChartBlock";
import { RegionsAndCityCharts } from "./analytics/chars/RegionsAndCityCharts";
import CategoryTotals from "./analytics/CategoryTotals";
import {
  cities,
  regions,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";

export default function DashboardPage() {
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

  return (
    <div className="flex flex-col gap-6 p-4">
      <CategoryTotals />
      <StatsCards />
      <DashboardChartBlock />
      <RegionsAndCityCharts regionData={regionData} cityData={cityData} />
    </div>
  );
}
