import { getTicketStats } from "@/actions/categories/contactMeAction";

export default async function TotalMessages() {
  const res = await getTicketStats().catch(() => ({ total: 0 }));
  const total = (res as any)?.total ?? 0;
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 font-medium truncate">Messages</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
