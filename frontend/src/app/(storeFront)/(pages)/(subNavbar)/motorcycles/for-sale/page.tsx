import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForSaleClient from "./MotorcyclesForSaleClient";

export const revalidate = 60;

export default async function MotorcyclesForSalePage() {
  const data = await getMotorcycles(1, 40).catch(() => []);
  return <MotorcyclesForSaleClient initialData={data ?? []} />;
}
