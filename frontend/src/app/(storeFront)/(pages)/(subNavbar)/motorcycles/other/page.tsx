import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import OtherItemsClient from "./OtherItemsClient";


export default async function OtherItemsPage() {

  return <OtherItemsClient initialData={[]} />;
}
