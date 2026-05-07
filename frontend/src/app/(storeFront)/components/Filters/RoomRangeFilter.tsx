"use client";

import { useState } from "react";

interface RoomRangeFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function RoomRangeFilter({ onFilterChange }: RoomRangeFilterProps) {
  const [maxRooms, setMaxRooms] = useState(10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxRooms(value);
    onFilterChange((prev: any) => ({ ...prev, maxRooms: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">
          Qolalka (Rooms)
        </span>
        <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2.5 py-0.5 rounded-full">
          0 – {maxRooms}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={maxRooms}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-gray-400 font-medium">0</span>
        <span className="text-[10px] text-gray-400 font-medium">10</span>
      </div>
    </div>
  );
}
