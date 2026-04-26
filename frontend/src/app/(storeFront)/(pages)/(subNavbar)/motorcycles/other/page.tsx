import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import OtherItemsClient from "./OtherItemsClient";

export const dynamic = "force-dynamic";

export default async function OtherItemsPage() {

  return <OtherItemsClient initialData={[]} />;
}
