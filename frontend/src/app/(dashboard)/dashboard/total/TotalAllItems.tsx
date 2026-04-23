import { getTotalMarketplaceItemsCount } from "@/actions/categories/marketplaceActions";
import { getTotalRealEstateCount } from "@/actions/categories/realEstateActions";
import { getTotalMotorcyclesAction } from "@/actions/categories/motorcycleActions";
import { getTotalCars } from "@/actions/categories/carActions";
import { getTotalBoatsAction } from "@/actions/categories/boatActions";
import { getFarmEquipmentTotal } from "@/actions/categories/FarmequipmentAction";

export default async function TotalAllItems() {
  const [marketplace, realEstate, motorcycles, cars, boats, farmEquipment] =
    await Promise.all([
      getTotalMarketplaceItemsCount().catch(() => 0),
      getTotalRealEstateCount().catch(() => 0),
      getTotalMotorcyclesAction().catch(() => 0),
      getTotalCars().catch(() => 0),
      getTotalBoatsAction().catch(() => 0),
      getFarmEquipmentTotal().catch(() => 0),
    ]);

  const total =
    Number(marketplace) + Number(realEstate) + Number(motorcycles) +
    Number(cars) + Number(boats) + Number(farmEquipment);

  return (
    <div className="flex flex-col items-center justify-center text-center px-1">
      <h4 className="text-[9px] text-gray-400 font-medium truncate w-full uppercase tracking-wide">
        Total
      </h4>
      <p className="text-xl font-black text-green-600 mt-0.5 tabular-nums">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
