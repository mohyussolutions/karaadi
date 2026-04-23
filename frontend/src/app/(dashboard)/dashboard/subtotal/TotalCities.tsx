import { getTotalOfCities } from "@/actions/categories/geoAction";

export default async function TotalCities() {
  const total = await getTotalOfCities().catch(() => 0);
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 font-medium truncate">Cities Linked</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
