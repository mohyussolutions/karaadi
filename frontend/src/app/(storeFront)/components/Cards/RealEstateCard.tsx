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
  const { id, title, purpose, area, rooms, region, description, ...rest } =
    props;

  const renderBadges = () => (
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
      {props.maGaday && (
        <span className="bg-orange-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md border border-orange-800">
          waa la gatay
        </span>
      )}
      {purpose && (
        <span className="bg-blue-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md border border-blue-800">
          {purpose}
        </span>
      )}
    </div>
  );

  const renderMeta = () => (
    <div className="flex flex-wrap gap-2 pt-2 mb-1">
      {area && (
        <div className="bg-gray-100 border border-gray-200 text-black px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className="text-base font-black">{area}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            m²
          </span>
        </div>
      )}
      {rooms && (
        <div className="bg-gray-100 border border-gray-200 text-black px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
          <span className="text-base font-black">{rooms}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Qol
          </span>
        </div>
      )}
    </div>
  );

  const renderFooter = () => (
    <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
      <span className="bg-emerald-50 text-emerald-800 font-black text-[11px] px-3 py-1.5 rounded-md uppercase tracking-widest border border-emerald-100">
        {rest.city}
        {region ? `, ${region}` : ""}
      </span>
      <span className="bg-gray-50 text-gray-900 text-[11px] px-3 py-1.5 rounded-md uppercase font-black tracking-widest border border-gray-200">
        Guryaha
      </span>
    </div>
  );

  return (
    <UniversalCard
      id={id || ""}
      title={title}
      description={description}
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
