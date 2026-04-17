import { getTotalBoatsAction } from "@/actions/categories/boatActions";

export default async function TotalBoats() {
  const total = await getTotalBoatsAction().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Boats</h4>
      <p className="text-xl font-bold text-gray-800 mt-1">
        {Number(total).toLocaleString()}
      </p>
    </div>
  );
}
