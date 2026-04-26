import { getBoats } from "@/actions/categories/boatActions";
import BoatsForRentClient from "./BoatsForRentClient";

export const dynamic = "force-dynamic";

export default async function BoatsForRentPage() {

  return <BoatsForRentClient initialData={[]} />;
}
