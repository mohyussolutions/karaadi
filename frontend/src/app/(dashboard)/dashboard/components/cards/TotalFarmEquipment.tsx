import { getFarmEquipmentTotal } from "@/actions/categories/FarmequipmentAction";

export default async function TotalFarmEquipment() {
  const total = await getFarmEquipmentTotal().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Farm Equipment</h4>
      <p className="text-2xl font-black text-slate-900 mt-1">
        {Number(total).toLocaleString()}
      </p>
    </div>
  );
}
