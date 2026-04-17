import { getCars } from "@/actions/categories/carActions";
import CarPartsClient from "./CarPartsClient";

export const revalidate = 60;

export default async function CarPartsPage() {
  const data = await getCars(1, 40).catch(() => []);
  return <CarPartsClient initialData={data ?? []} />;
}
