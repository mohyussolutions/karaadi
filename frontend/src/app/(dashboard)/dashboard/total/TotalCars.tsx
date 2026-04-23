import { getTotalCars } from "@/actions/categories/carActions";

export default async function TotalCars() {
  const total = await getTotalCars().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center px-1">
      <h4 className="text-[9px] text-gray-400 font-medium truncate w-full">Cars</h4>
      <p className="text-xl font-black text-gray-900 mt-0.5 tabular-nums">{Number(total).toLocaleString()}</p>
    </div>
  );
}
