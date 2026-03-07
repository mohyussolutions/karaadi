"use client";

import React, { FC } from "react";
import { BarChartBlock } from "../BarChartBlock";

interface RegionsAndCityChartsProps {
  regionData: any[];
  cityData: any[];
}

export const RegionsAndCityCharts: FC<RegionsAndCityChartsProps> = ({
  regionData,
  cityData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border p-2 shadow-sm pointer-events-none">
        <BarChartBlock
          title="REGIONAL MARKET PENETRATION"
          data={regionData}
          dataKey="buyers"
          barColor="#6366F1"
        />
      </div>
      <div className="bg-white rounded-xl border p-2 shadow-sm pointer-events-none">
        <BarChartBlock
          title="URBAN BUYER DENSITY"
          data={cityData}
          dataKey="buyers"
          barColor="#10B981"
        />
      </div>
    </div>
  );
};
