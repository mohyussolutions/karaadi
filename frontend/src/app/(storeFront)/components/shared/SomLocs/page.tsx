"use client";

import React from "react";

interface SomaliMapProps {
  selectedRegion: string | null;
  onRegionClick: (region: string | null) => void;
}

function SomaliMap({ selectedRegion, onRegionClick }: SomaliMapProps) {
  return (
    <div className="bg-white border rounded-md shadow-sm p-3 max-h-[96vh] overflow-auto w-64">
      <p className="text-sm text-gray-600">
        Interactive Somali map placeholder.
      </p>

      {selectedRegion && (
        <p className="mt-2 text-xs text-blue-600">
          Selected region: <strong>{selectedRegion}</strong>
        </p>
      )}

      <button
        onClick={() => onRegionClick(null)}
        className="mt-3 text-xs text-red-500 underline"
      >
        Clear region
      </button>
    </div>
  );
}

export default SomaliMap;
