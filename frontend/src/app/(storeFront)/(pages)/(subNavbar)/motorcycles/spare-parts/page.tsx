import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import SparePartsClient from "./SparePartsClient";

export const dynamic = "force-dynamic";

export default async function SparePartsPage() {

  return <SparePartsClient initialData={[]} />;
}
