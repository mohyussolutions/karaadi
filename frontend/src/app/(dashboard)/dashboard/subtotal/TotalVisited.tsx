import { fetchTotalVisitors } from "@/actions/categories/visitorActions";

export default async function TotalVisited() {
  const total = await fetchTotalVisitors().catch(() => 0);
  return (
    <div className="flex flex-col">
      <p className="text-[9px] text-gray-400 font-medium truncate">Total Visited</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
