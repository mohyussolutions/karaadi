import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import LandForSaleClient from "./LandForSaleClient";


export default async function LandForSalePage() {

  return <LandForSaleClient initialData={[]} />;
}
