import { getCars } from "@/actions/categories/carActions";
import CarsForSaleClient from "./CarsForSaleClient";

export const revalidate = 60;

export default async function CarsForSalePage() {
  const data = await getCars(1, 40).catch(() => []);
  return <CarsForSaleClient initialData={data ?? []} />;
}
