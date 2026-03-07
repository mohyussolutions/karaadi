"use client";

import React from "react";
import UniversalCard from "./UniversalCard";

interface RealEstateCardProps {
  id?: string;
  title: string;
  price: number;
  city: string;
  region?: string;
  purpose?: string;
  area?: string;
  rooms?: number;
  images?: string[];
  description?: string | string[];
  maGaday?: boolean;
}

export default function RealEstateCard(props: RealEstateCardProps) {
  const { id, purpose, area, rooms, region, ...rest } = props;

  const renderBadges = () => (
    <>
      {props.maGaday && (
        <span className="absolute top-3 left-3 bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
          waa la gatay
        </span>
      )}
      {purpose && (
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-sm">
          {purpose}
        </span>
      )}
    </>
  );

  const renderMeta = () => (
    <div className="flex flex-wrap gap-2 pt-1">
      {area && (
        <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-medium">
          {area} m²
        </span>
      )}
      {rooms && (
        <span className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-md font-medium">
          {rooms} Qol
        </span>
      )}
    </div>
  );

  const renderFooter = () => (
    <>
      <span className="text-emerald-600 font-semibold text-[11px] uppercase tracking-wider">
        {rest.city}
        {region ? `, ${region}` : ""}
      </span>
    </>
  );

  return (
    <UniversalCard
      id={id || ""}
      title={rest.title}
      description={rest.description}
      images={rest.images}
      price={rest.price}
      city={rest.city}
      maGaday={rest.maGaday}
      category="real-estate"
      renderBadges={renderBadges}
      renderMeta={renderMeta}
      renderFooter={renderFooter}
    />
  );
}
