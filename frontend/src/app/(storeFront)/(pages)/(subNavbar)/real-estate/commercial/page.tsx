import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import CommercialClient from "./CommercialClient";

export const revalidate = 60;

export default async function CommercialPage() {
  const data = await getRealEstateListings(1, 40).catch(() => []);
  return <CommercialClient initialData={data ?? []} />;
}
