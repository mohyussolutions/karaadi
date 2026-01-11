"use client";

import TotalBoats from "../categories/boats/TotalBoats";
import TotalCars from "../categories/cars/TotalCars";
import TotalMarketplace from "../categories/marketplace/TotalMarketplace";
import TotalMotorcycles from "../categories/motorcycles/TotalMotorcycles";
import TotalProperties from "../categories/real-estate/TotalProperties";
import TotalTraktors from "../categories/traktors/TotalTraktors";

const CategoryTotals: React.FC = () => {
  const cardClass =
    "w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center text-center font-bold transition-all duration-200 hover:scale-105 hover:bg-gray-200 hover:text-white-900 bg-green-500";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center ">
      <div className={cardClass}>
        <TotalMarketplace />
      </div>
      <div className={cardClass}>
        <TotalCars />
      </div>
      <div className={cardClass}>
        <TotalBoats />
      </div>
      <div className={cardClass}>
        <TotalMotorcycles />
      </div>
      <div className={cardClass}>
        <TotalProperties />
      </div>
      <div className={cardClass}>
        <TotalTraktors />
      </div>
    </div>
  );
};

export default CategoryTotals;
