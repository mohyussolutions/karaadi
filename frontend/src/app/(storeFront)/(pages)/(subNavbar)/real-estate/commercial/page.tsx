import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import CommercialClient from "./CommercialClient";

export const dynamic = "force-dynamic";

export default async function CommercialPage() {

  return <CommercialClient initialData={[]} />;
}
