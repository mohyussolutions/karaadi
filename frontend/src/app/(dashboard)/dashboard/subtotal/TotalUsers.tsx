import { getTotalUsersAction } from "@/actions/categories/usersAction";

export default async function TotalUsers() {
  const res = await getTotalUsersAction().catch(() => ({ data: 0 }));
  const total = (res as any)?.data ?? 0;
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 font-medium truncate">Total Users</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
