import { getAgencyStats } from "@/actions/categories/actionsAgency";

export default async function TotalAgencies() {
  const data = await getAgencyStats().catch(() => null);
  const total = (data as any)?.total ?? 0;
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center text-center">
      <h2 className="text-lg font-semibold text-gray-700">Agencies</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
