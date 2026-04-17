import { getCars } from "@/actions/categories/carActions";
import ElectricCarsClient from "./ElectricCarsClient";

export const revalidate = 60;

export default async function ElectricCarsPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <ElectricCarsClient initialData={data ?? []} />;
}
