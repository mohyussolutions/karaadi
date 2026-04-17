import { getTotalCars } from "@/actions/categories/carActions";

export default async function TotalCars() {
  const total = await getTotalCars().catch(() => 0);
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="text-gray-500 text-sm">Cars</h4>
      <p className="text-xl font-bold text-gray-800 mt-1">
        {Number(total).toLocaleString()}
      </p>
    </div>
  );
}
