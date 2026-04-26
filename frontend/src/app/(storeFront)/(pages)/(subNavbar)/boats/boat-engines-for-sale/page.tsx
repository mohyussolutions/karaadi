import { getBoats } from "@/actions/categories/boatActions";
import BoatEnginesClient from "./BoatEnginesClient";

export const dynamic = "force-dynamic";

export default async function BoatEnginesPage() {

  return <BoatEnginesClient initialData={[]} />;
}
