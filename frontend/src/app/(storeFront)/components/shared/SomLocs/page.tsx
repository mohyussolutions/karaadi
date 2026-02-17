"use client";

import React, { useState, useMemo } from "react";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

interface SomaliMapProps {
  selectedRegion: string | null;
  onRegionClick: (region: string | null) => void;
  items: any[];
  categoryLabel?: string;
}

const formatName = (name: string) =>
  name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

export default function SomaliMap({
  selectedRegion,
  onRegionClick,
  items,
  categoryLabel = "Items",
}: SomaliMapProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const SOMALIA_CENTER = { lat: 5.1521, lng: 46.1996 };

  const validItems = useMemo(() => {
    return items
      .map((item) => {
        const lat = Number(
          item.latitude || item.extra?.lat || item.extra?.latitude,
        );
        const lng = Number(
          item.longitude || item.extra?.lng || item.extra?.longitude,
        );
        return { ...item, lat, lng };
      })
      .filter((item) => !isNaN(item.lat) && !isNaN(item.lng) && item.lat !== 0);
  }, [items]);

  const regionTotals = useMemo(() => {
    return items.reduce((acc: Record<string, number>, item) => {
      if (item.region) {
        const formatted = formatName(item.region);
        acc[formatted] = (acc[formatted] || 0) + 1;
      }
      return acc;
    }, {});
  }, [items]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full text-center">
        <p className="text-sm font-bold text-red-600">Map Error</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="bg-white border rounded-xl shadow-sm p-4 w-full">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Location Map
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <p className="text-xs font-bold text-gray-700">
                {selectedRegion
                  ? `${formatName(selectedRegion)}: `
                  : "All Regions: "}
                <span className="text-blue-600">
                  {selectedRegion
                    ? regionTotals[formatName(selectedRegion)] || 0
                    : items.length}{" "}
                  {categoryLabel}
                </span>
              </p>
            </div>
          </div>

          {selectedRegion && (
            <button
              onClick={() => onRegionClick(null)}
              className="text-[10px] bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 px-2 py-1 rounded-md font-bold transition-colors"
            >
              CLEAR FILTER
            </button>
          )}
        </div>

        <div className="w-full h-[350px] rounded-xl border border-gray-100 overflow-hidden shadow-inner bg-gray-50">
          <Map
            defaultCenter={SOMALIA_CENTER}
            defaultZoom={5.2}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            zoomControl={true}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
          >
            {validItems.map((item) => (
              <React.Fragment key={item._id || item.id}>
                <Marker
                  position={{ lat: item.lat, lng: item.lng }}
                  onClick={() => setSelectedItemId(item._id || item.id)}
                />
                {selectedItemId === (item._id || item.id) && (
                  <InfoWindow
                    position={{ lat: item.lat, lng: item.lng }}
                    onCloseClick={() => setSelectedItemId(null)}
                  >
                    <div className="p-1 min-w-[120px]">
                      <p className="font-bold text-blue-800 text-[11px] leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-black text-green-600 mt-1">
                        ${Number(item.price).toLocaleString()}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[9px] text-gray-500 font-bold">
                          {formatName(item.city)} • {formatName(item.region)}
                        </p>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </Map>
        </div>

        <div className="mt-4">
          <p className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-tighter">
            Filter by Region
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(regionTotals).map(([region, count]) => (
              <button
                key={region}
                onClick={() => onRegionClick(region)}
                className={`text-[10px] px-3 py-1.5 rounded-lg border font-black transition-all flex items-center gap-1.5 ${
                  selectedRegion?.toLowerCase() === region.toLowerCase()
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-500"
                }`}
              >
                {region}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                    selectedRegion?.toLowerCase() === region.toLowerCase()
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
