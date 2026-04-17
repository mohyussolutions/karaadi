import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import OtherItemsClient from "./OtherItemsClient";

export const revalidate = 60;

export default async function OtherItemsPage() {
  const data = await getMotorcycles(1, 40).catch(() => []);
  return <OtherItemsClient initialData={data ?? []} />;
}
