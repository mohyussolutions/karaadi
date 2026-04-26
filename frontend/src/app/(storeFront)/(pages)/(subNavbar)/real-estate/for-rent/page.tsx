import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import ForRentClient from "./ForRentClient";

export const dynamic = "force-dynamic";

export default async function ForRentPage() {

  return <ForRentClient initialData={[]} />;
}
