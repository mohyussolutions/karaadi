import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForSaleClient from "./MotorcyclesForSaleClient";

export const dynamic = "force-dynamic";

export default async function MotorcyclesForSalePage() {

  return <MotorcyclesForSaleClient initialData={[]} />;
}
