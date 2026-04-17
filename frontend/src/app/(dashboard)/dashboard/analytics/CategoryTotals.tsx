import React, { Suspense } from "react";
import TotalBoats from "../components/cards/TotalBoats";
import TotalCars from "../components/cards/TotalCars";
import TotalFarmEquipment from "../components/cards/TotalFarmEquipment";
import TotalListings from "../components/cards/TotalListings";
import TotalMarketplace from "../components/cards/TotalMarketplace";
import TotalMotorcycles from "../components/cards/TotalMotorcycles";
import TotalProperties from "../components/cards/TotalProperties";

const circleClass =
  "w-28 h-28 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 border-2 border-green-100 rounded-full bg-white shadow-sm hover:border-green-500 hover:shadow-md";

const Fallback = () => (
  <div className="w-8 h-8 rounded-full border-2 border-gray-100 animate-pulse" />
);

const CategoryTotals: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 place-items-center py-6 min-h-auto">
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalMarketplace />
        </Suspense>
      </div>
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalProperties />
        </Suspense>
      </div>
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalMotorcycles />
        </Suspense>
      </div>
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalCars />
        </Suspense>
      </div>
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalBoats />
        </Suspense>
      </div>
      <div className={circleClass}>
        <Suspense fallback={<Fallback />}>
          <TotalFarmEquipment />
        </Suspense>
      </div>
      <div className={`${circleClass} border-green-400 bg-green-50`}>
        <Suspense fallback={<Fallback />}>
          <TotalListings />
        </Suspense>
      </div>
    </div>
  );
};

export default CategoryTotals;
