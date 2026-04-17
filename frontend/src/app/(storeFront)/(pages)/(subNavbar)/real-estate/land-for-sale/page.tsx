import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import LandForSaleClient from "./LandForSaleClient";

export const revalidate = 60;

export default async function LandForSalePage() {
  const data = await getRealEstateListings(1, 40).catch(() => []);
  return <LandForSaleClient initialData={data ?? []} />;
}
