import { getBoats } from "@/actions/categories/boatActions";
import BoatsForSaleClient from "./BoatsForSaleClient";

export const revalidate = 60;

export default async function BoatsForSalePage() {
  const data = await getBoats(1, 40).catch(() => []);
  return <BoatsForSaleClient initialData={data ?? []} />;
}
