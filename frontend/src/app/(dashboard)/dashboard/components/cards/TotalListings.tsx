import { getTotalMarketplaceItemsCount } from "@/actions/categories/marketplaceActions";
import { getTotalCars } from "@/actions/categories/carActions";
import { getTotalBoatsAction } from "@/actions/categories/boatActions";
import { getTotalMotorcyclesAction } from "@/actions/categories/motorcycleActions";
import { getTotalRealEstateCount } from "@/actions/categories/realEstateActions";
import { getFarmEquipmentTotal } from "@/actions/categories/FarmequipmentAction";

export default async function TotalListings() {
  const [marketplace, cars, boats, motorcycles, realEstate, farmEquipment] =
    await Promise.all([
      getTotalMarketplaceItemsCount().catch(() => 0),
      getTotalCars().catch(() => 0),
      getTotalBoatsAction().catch(() => 0),
      getTotalMotorcyclesAction().catch(() => 0),
      getTotalRealEstateCount().catch(() => 0),
      getFarmEquipmentTotal().catch(() => 0),
    ]);

  const total =
    Number(marketplace) +
    Number(cars) +
    Number(boats) +
    Number(motorcycles) +
    Number(realEstate) +
    Number(farmEquipment);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
        Total Listings
      </h4>
      <p className="text-2xl font-black text-green-600 mt-1">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
