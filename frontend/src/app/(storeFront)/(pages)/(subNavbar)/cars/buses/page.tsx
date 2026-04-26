import { getCars } from "@/actions/categories/carActions";
import BusesClient from "./BusesClient";

export const dynamic = "force-dynamic";

export default async function BusesPage() {

  return <BusesClient initialData={[]} />;
}
