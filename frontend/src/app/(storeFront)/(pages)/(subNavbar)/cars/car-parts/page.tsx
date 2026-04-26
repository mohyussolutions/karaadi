import { getCars } from "@/actions/categories/carActions";
import CarPartsClient from "./CarPartsClient";

export const dynamic = "force-dynamic";

export default async function CarPartsPage() {

  return <CarPartsClient initialData={[]} />;
}
