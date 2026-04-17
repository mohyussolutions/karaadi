import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForRentClient from "./MotorcyclesForRentClient";

export const revalidate = 60;

export default async function MotorcyclesForRentPage() {
  const data = await getMotorcycles(1, 40).catch(() => []);
  return <MotorcyclesForRentClient initialData={data ?? []} />;
}
