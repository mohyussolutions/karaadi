import { getBoats } from "@/actions/categories/boatActions";
import BoatsForSaleClient from "./BoatsForSaleClient";

export const dynamic = "force-dynamic";

export default async function BoatsForSalePage() {

  return <BoatsForSaleClient initialData={[]} />;
}
