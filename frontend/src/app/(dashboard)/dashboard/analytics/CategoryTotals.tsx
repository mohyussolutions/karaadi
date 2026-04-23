interface CategoryTotalsProps {
  totals: {
    marketplace: number;
    cars: number;
    boats: number;
    motorcycles: number;
    realEstate: number;
    farmEquipment: number;
  };
}

const circleClass =
  "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center text-center transition-all duration-300 hover:scale-105 border-2 border-green-100 rounded-full bg-white shadow-sm hover:border-green-500 hover:shadow-md";

interface CircleCardProps {
  label: string;
  value: number;
  labelClass?: string;
  valueClass?: string;
}

const CircleCard = ({
  label,
  value,
  labelClass = "text-gray-500 text-[10px] sm:text-xs leading-tight",
  valueClass = "text-base sm:text-lg md:text-xl font-bold text-gray-800 mt-0.5",
}: CircleCardProps) => (
  <div className="flex flex-col items-center justify-center text-center px-1">
    <h4 className={labelClass}>{label}</h4>
    <p className={valueClass}>{value.toLocaleString()}</p>
  </div>
);

export default function CategoryTotals({ totals }: CategoryTotalsProps) {
  const total =
    totals.marketplace + totals.cars + totals.boats +
    totals.motorcycles + totals.realEstate + totals.farmEquipment;

  return (
    <div className="grid grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 md:gap-6 place-items-center py-3 sm:py-6">
      <div className={circleClass}>
        <CircleCard label="Marketplace" value={totals.marketplace} />
      </div>
      <div className={circleClass}>
        <CircleCard
          label="Properties"
          value={totals.realEstate}
          labelClass="text-gray-500 text-[10px] sm:text-xs leading-tight"
          valueClass="text-base sm:text-lg md:text-2xl font-black text-slate-900 mt-0.5"
        />
      </div>
      <div className={circleClass}>
        <CircleCard
          label="Motorcycles"
          value={totals.motorcycles}
          valueClass="text-base sm:text-lg md:text-2xl font-black text-slate-800 mt-0.5"
        />
      </div>
      <div className={circleClass}>
        <CircleCard label="Cars" value={totals.cars} />
      </div>
      <div className={circleClass}>
        <CircleCard label="Boats" value={totals.boats} />
      </div>
      <div className={circleClass}>
        <CircleCard
          label="Farm Equipment"
          value={totals.farmEquipment}
          valueClass="text-base sm:text-lg md:text-2xl font-black text-slate-900 mt-0.5"
        />
      </div>
      <div className={`${circleClass} border-green-400 bg-green-50`}>
        <div className="flex flex-col items-center justify-center text-center px-1">
          <h4 className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide leading-tight">
            Total Listings
          </h4>
          <p className="text-base sm:text-lg md:text-2xl font-black text-green-600 mt-0.5">
            {total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
