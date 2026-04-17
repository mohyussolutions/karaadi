import { getTotalUsersAction } from "@/actions/categories/usersAction";

export default async function TotalUsers() {
  const result = await getTotalUsersAction().catch(() => ({ data: 0 }));
  const total = (result as any)?.data ?? 0;
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {total.toLocaleString()}
      </p>
    </div>
  );
}
