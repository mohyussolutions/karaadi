import { getCars } from "@/actions/categories/carActions";
import BusesClient from "./BusesClient";


export default async function BusesPage() {

  return <BusesClient initialData={[]} />;
}
