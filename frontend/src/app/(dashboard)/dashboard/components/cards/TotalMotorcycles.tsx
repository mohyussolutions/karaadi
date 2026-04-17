import { getTotalMotorcyclesAction } from "@/actions/categories/motorcycleActions";

export default async function TotalMotorcycles() {
  const total = await getTotalMotorcyclesAction().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h4 className="text-gray-500 text-sm">Motorcycles</h4>
      <p className="text-2xl font-black text-slate-800 mt-1">
        {Number(total).toLocaleString()}
      </p>
    </div>
  );
}
