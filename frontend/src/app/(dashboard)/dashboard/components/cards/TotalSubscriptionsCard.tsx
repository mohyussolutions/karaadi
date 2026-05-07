import { getTotalSubscriptions } from "@/actions/categories/subscriptionsActions";

export default async function TotalSubscriptions() {
  const data = await getTotalSubscriptions().catch(() => null);
  const total = (data as any)?.total ?? (data as any)?.count ?? 0;
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Subscriptions</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
