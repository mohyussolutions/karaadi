import { getBoats } from "@/actions/categories/boatActions";
import BoatPartsClient from "./BoatPartsClient";


export default async function BoatPartsPage() {

  return <BoatPartsClient initialData={[]} />;
}
