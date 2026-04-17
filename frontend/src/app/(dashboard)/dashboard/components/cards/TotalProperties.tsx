import { getTotalRealEstateCount } from "@/actions/categories/realEstateActions";

export default async function TotalProperties() {
  const total = await getTotalRealEstateCount().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
      <h4 className="text-gray-500 text-sm">Total Properties</h4>
      <p className="text-2xl font-black text-slate-900 mt-1">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
