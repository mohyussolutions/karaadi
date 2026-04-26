import { getCars } from "@/actions/categories/carActions";
import CarsForSaleClient from "./CarsForSaleClient";

export const dynamic = "force-dynamic";

export default async function CarsForSalePage() {

  return <CarsForSaleClient initialData={[]} />;
}
