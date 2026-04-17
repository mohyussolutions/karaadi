import { getTotalOfCities } from "@/actions/categories/geoAction";

export default async function TotalCities() {
  const total = await getTotalOfCities().catch(() => 0);
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center text-center">
      <h2 className="text-lg font-semibold text-gray-700">Cities</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
