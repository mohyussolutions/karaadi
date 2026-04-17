import { getBoats } from "@/actions/categories/boatActions";
import BoatPartsClient from "./BoatPartsClient";

export const revalidate = 60;

export default async function BoatPartsPage() {
  const data = await getBoats(1, 40).catch(() => []);
  return <BoatPartsClient initialData={data ?? []} />;
}
