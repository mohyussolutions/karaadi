import { getCars } from "@/actions/categories/carActions";
import BusesClient from "./BusesClient";

export const revalidate = 60;

export default async function BusesPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <BusesClient initialData={data ?? []} />;
}
