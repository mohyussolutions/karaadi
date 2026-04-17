import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import SparePartsClient from "./SparePartsClient";

export const revalidate = 60;

export default async function SparePartsPage() {
  const data = await getMotorcycles(1, 40).catch(() => []);
  return <SparePartsClient initialData={data ?? []} />;
}
