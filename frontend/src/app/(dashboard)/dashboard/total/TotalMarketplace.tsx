import { getTotalMarketplaceItemsCount } from "@/actions/categories/marketplaceActions";

export default async function TotalMarketplace() {
  const total = await getTotalMarketplaceItemsCount().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center px-1">
      <h4 className="text-[9px] text-gray-400 font-medium truncate w-full">Marketplace</h4>
      <p className="text-xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
