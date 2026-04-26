import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import LandForSaleClient from "./LandForSaleClient";

export const dynamic = "force-dynamic";

export default async function LandForSalePage() {

  return <LandForSaleClient initialData={[]} />;
}
