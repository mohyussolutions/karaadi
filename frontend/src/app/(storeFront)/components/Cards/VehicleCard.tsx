"use client";

import React from "react";
import UniversalCard from "./UniversalCard";

export default function VehicleCard({
  id,
  make,
  model,
  year,
  mileage,
  ...rest
}: any) {
  const renderMeta = () => (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {[make, model, year, mileage ? `${mileage.toLocaleString()} km` : null]
        .filter(Boolean)
        .map((val) => (
          <span
            key={String(val)}
            className="bg-gray-50 text-gray-500 text-[9px] px-2 py-0.5 rounded font-bold uppercase"
          >
            {val}
          </span>
        ))}
    </div>
  );

  return (
    <UniversalCard
      {...rest}
      id={id}
      category="vehicles"
      title={make && model ? `${make} ${model}` : rest.title}
      renderMeta={renderMeta}
    />
  );
}
