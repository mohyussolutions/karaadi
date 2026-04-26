import { getBoats } from "@/actions/categories/boatActions";
import BoatPartsClient from "./BoatPartsClient";

export const dynamic = "force-dynamic";

export default async function BoatPartsPage() {

  return <BoatPartsClient initialData={[]} />;
}
