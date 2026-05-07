import { getBoats } from "@/actions/categories/boatActions";
import BoatEnginesClient from "./BoatEnginesClient";


export default async function BoatEnginesPage() {

  return <BoatEnginesClient initialData={[]} />;
}
