"use client";

import { useState } from "react";

interface PriceRangeFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function PriceRangeFilter({
  onFilterChange,
}: PriceRangeFilterProps) {
  const [maxPrice, setMaxPrice] = useState(1000000);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(Number(value));
    onFilterChange((prev: any) => ({ ...prev, maxPrice: value }));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-100 mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            Qiimaha (Price)
          </label>
          <span className="text-blue-600 font-bold text-sm">
            $0 - ${maxPrice.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1000000"
          step="500"
          value={maxPrice}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          onChange={handlePriceChange}
        />
      </div>
    </div>
  );
}
