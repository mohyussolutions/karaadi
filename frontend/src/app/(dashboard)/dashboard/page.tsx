"use client";

import React, { useEffect, useState } from "react";
import { StatsCards } from "./analytics/StatsCards";
import { DashboardChartBlock } from "./analytics/chars/DashboardChartBlock";
import { RegionsAndCityCharts } from "./analytics/chars/RegionsAndCityCharts";
import CategoryTotals from "./analytics/CategoryTotals";
import { getAllCities, getAllRegions } from "@/actions/categories/geoAction";
import { Region, City } from "@/app/utils/types/geoTypes";

interface ChartDataItem {
  name: string;
  buyers: number;
}

export default function DashboardPage() {
  const [regionData, setRegionData] = useState<ChartDataItem[]>([]);
  const [cityData, setCityData] = useState<ChartDataItem[]>([]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const regions: Region[] = await getAllRegions();
        const formatted: ChartDataItem[] = (regions || []).map((r) => ({
          name: r.name,
          buyers: Math.floor(Math.random() * 500) + 50,
        }));
        setRegionData(formatted);
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchCities() {
      try {
        const cities: City[] = await getAllCities();
        const formatted: ChartDataItem[] = (cities || [])
          .map((c) => ({
            name: c.name,
            buyers: Math.floor(Math.random() * 500) + 50,
          }))
          .sort((a: ChartDataItem, b: ChartDataItem) => b.buyers - a.buyers)
          .slice(0, 8);
        setCityData(formatted);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRegions();
    fetchCities();
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
