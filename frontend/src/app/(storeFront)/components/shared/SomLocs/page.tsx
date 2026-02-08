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
}

export default function SomaliMap({
  selectedRegion,
  onRegionClick,
  items,
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
      .filter((item) => !isNaN(item.lat) && !isNaN(item.lng));
  }, [items]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="bg-white border rounded-xl shadow-sm p-3 w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase">
            Khaarijada (Google Maps)
          </h3>
          {selectedRegion && (
            <button
              onClick={() => onRegionClick(null)}
              className="text-[10px] text-red-500 font-bold hover:underline"
            >
              Nadiifi
            </button>
          )}
        </div>

        <div className="w-full h-80 rounded-lg border border-gray-100 overflow-hidden">
          <Map
            defaultCenter={SOMALIA_CENTER}
            defaultZoom={5.5}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
          >
            {validItems.map((item) => (
              <React.Fragment key={item.id || item._id}>
                <Marker
                  position={{ lat: item.lat, lng: item.lng }}
                  onClick={() => setSelectedItemId(item.id || item._id)}
                />

                {selectedItemId === (item.id || item._id) && (
                  <InfoWindow
                    position={{ lat: item.lat, lng: item.lng }}
                    onCloseClick={() => setSelectedItemId(null)}
                  >
                    <div className="p-2 max-w-[150px]">
                      <h4 className="font-bold text-blue-700 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.price} USD
                      </p>
                      <p className="text-[10px] text-gray-400 italic mt-1">
                        {item.city}, {item.region}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            ))}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}
