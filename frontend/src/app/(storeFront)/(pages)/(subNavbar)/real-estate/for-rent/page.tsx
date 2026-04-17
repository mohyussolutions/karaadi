import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import ForRentClient from "./ForRentClient";

export const revalidate = 60;

export default async function ForRentPage() {
  const data = await getRealEstateListings(1, 40).catch(() => []);
  return <ForRentClient initialData={data ?? []} />;
}
