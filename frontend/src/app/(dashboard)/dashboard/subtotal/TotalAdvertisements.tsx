import { getAdStats } from "@/actions/categories/advertisementService";

export default async function TotalAdvertisements() {
  const res = await getAdStats().catch(() => ({ totalAds: 0 }));
  const total = (res as any)?.totalAds ?? 0;
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium truncate">Advertisements</p>
      <p className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
