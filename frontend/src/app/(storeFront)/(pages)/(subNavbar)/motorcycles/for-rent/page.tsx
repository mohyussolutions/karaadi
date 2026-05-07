import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForRentClient from "./MotorcyclesForRentClient";


export default async function MotorcyclesForRentPage() {

  return <MotorcyclesForRentClient initialData={[]} />;
}
