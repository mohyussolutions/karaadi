import { getBoats } from "@/actions/categories/boatActions";
import BoatEnginesClient from "./BoatEnginesClient";

export const revalidate = 60;

export default async function BoatEnginesPage() {
  const data = await getBoats(1, 40).catch(() => []);
  return <BoatEnginesClient initialData={data ?? []} />;
}
