"use client";

import { useState } from "react";

interface RoomRangeFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function RoomRangeFilter({
  onFilterChange,
}: RoomRangeFilterProps) {
  const [maxRooms, setMaxRooms] = useState(10);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxRooms(Number(value));
    onFilterChange((prev: any) => ({ ...prev, maxRooms: value }));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-100 mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Qolalka (Rooms)
          </label>
          <span className="text-blue-600 font-bold text-sm">
            0 - {maxRooms}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={maxRooms}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          onChange={handleRoomChange}
        />
      </div>
    </div>
  );
}
