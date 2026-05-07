import { Suspense } from "react";
import TotalMarketplace from "./TotalMarketplace";
import TotalProperties from "./TotalProperties";
import TotalMotorcycles from "./TotalMotorcycles";
import TotalCars from "./TotalCars";
import TotalBoats from "./TotalBoats";
import TotalFarmEquipment from "./TotalFarmEquipment";
import TotalAllItems from "./TotalAllItems";

const circleClass =
  "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 border-2 border-green-100 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:border-green-500 hover:shadow-md";

const Skeleton = () => (
  <div className={`${circleClass} animate-pulse bg-gray-100`} />
);

export default function CategoryTotals() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 md:gap-6 place-items-center py-3 sm:py-6">
      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalMarketplace />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalProperties />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalMotorcycles />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalCars />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalBoats />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={circleClass}>
          <TotalFarmEquipment />
        </div>
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <div className={`${circleClass} border-green-400 bg-green-50 hover:bg-green-100`}>
          <TotalAllItems />
        </div>
      </Suspense>
    </div>
  );
}
