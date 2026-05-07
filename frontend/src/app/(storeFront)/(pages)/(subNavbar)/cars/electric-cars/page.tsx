import { getCars } from "@/actions/categories/carActions";
import ElectricCarsClient from "./ElectricCarsClient";


export default async function ElectricCarsPage() {

  return <ElectricCarsClient initialData={[]} />;
}
