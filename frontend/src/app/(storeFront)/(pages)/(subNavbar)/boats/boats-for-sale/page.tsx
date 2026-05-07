import { getBoats } from "@/actions/categories/boatActions";
import BoatsForSaleClient from "./BoatsForSaleClient";


export default async function BoatsForSalePage() {

  return <BoatsForSaleClient initialData={[]} />;
}
