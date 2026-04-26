import { getCars } from "@/actions/categories/carActions";
import ElectricCarsClient from "./ElectricCarsClient";

export const dynamic = "force-dynamic";

export default async function ElectricCarsPage() {

  return <ElectricCarsClient initialData={[]} />;
}
