import { getTotalSubscriptions } from "@/actions/categories/subscriptionsActions";

export default async function TotalSubscriptions() {
  const res = await getTotalSubscriptions().catch(() => ({ total: 0 }));
  const total = (res as any)?.total ?? (res as any)?.count ?? 0;
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 font-medium truncate">Subscriptions</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
