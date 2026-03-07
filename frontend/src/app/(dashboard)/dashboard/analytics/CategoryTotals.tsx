"use client";

import React from "react";
import TotalBoats from "../categories/boats/TotalBoats";
import TotalCars from "../categories/cars/TotalCars";
import TotalFarmEquipment from "../categories/farmequipment/TotalFarmEquipment";
import TotalMarketplace from "../categories/marketplace/TotalMarketplace";
import TotalMotorcycles from "../categories/motorcycles/TotalMotorcycles";
import TotalProperties from "../categories/real-estate/TotalProperties";

const CategoryTotals: React.FC = () => {
  const circleClass =
    "w-28 h-28 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 border-2 border-green-100 rounded-full bg-white shadow-sm hover:border-green-500 hover:shadow-md";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center py-6">
      <div className={circleClass}>
        <TotalMarketplace />
      </div>
      <div className={circleClass}>
        <TotalCars />
      </div>
      <div className={circleClass}>
        <TotalBoats />
      </div>
      <div className={circleClass}>
        <TotalMotorcycles />
      </div>
      <div className={circleClass}>
        <TotalProperties />
      </div>
      <div className={circleClass}>
        <TotalFarmEquipment />
      </div>
    </div>
  );
};

export default CategoryTotals;
