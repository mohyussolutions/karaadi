import { getAdStats } from "@/actions/categories/advertisementService";

export default async function TotalAdvertisement() {
  const stats = await getAdStats().catch(() => null);
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Advertisements</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {(stats?.totalAds ?? 0).toLocaleString()}
      </p>
    </div>
  );
}
