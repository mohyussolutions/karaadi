import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import CommercialClient from "./CommercialClient";


export default async function CommercialPage() {

  return <CommercialClient initialData={[]} />;
}
