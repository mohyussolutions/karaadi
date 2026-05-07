import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForSaleClient from "./MotorcyclesForSaleClient";


export default async function MotorcyclesForSalePage() {

  return <MotorcyclesForSaleClient initialData={[]} />;
}
