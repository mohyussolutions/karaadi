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
      <BarChartBlock
        title="Top Regions by Buyers"
        data={regionData}
        dataKey="buyers"
        barColor="#6366F1"
      />
      <BarChartBlock
        title="Top Cities by Buyers"
        data={cityData}
        dataKey="buyers"
        barColor="#10B981"
      />
    </div>
  );
};
