import { getBoats } from "@/actions/categories/boatActions";
import BoatsForRentClient from "./BoatsForRentClient";

export const revalidate = 60;

export default async function BoatsForRentPage() {
  const data = await getBoats(1, 40).catch(() => []);
  return <BoatsForRentClient initialData={data ?? []} />;
}
