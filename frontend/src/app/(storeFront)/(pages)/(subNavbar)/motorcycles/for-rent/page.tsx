import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import MotorcyclesForRentClient from "./MotorcyclesForRentClient";

export const dynamic = "force-dynamic";

export default async function MotorcyclesForRentPage() {

  return <MotorcyclesForRentClient initialData={[]} />;
}
