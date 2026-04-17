import { getCars } from "@/actions/categories/carActions";
import RentCarsClient from "./RentCarsClient";

export const revalidate = 60;

export default async function LeaseCarsPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <RentCarsClient initialData={data ?? []} />;
}
