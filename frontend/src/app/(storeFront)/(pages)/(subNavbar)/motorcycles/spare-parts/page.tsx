import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import SparePartsClient from "./SparePartsClient";


export default async function SparePartsPage() {

  return <SparePartsClient initialData={[]} />;
}
