import { getCars } from "@/actions/categories/carActions";
import CarsForSaleClient from "./CarsForSaleClient";


export default async function CarsForSalePage() {

  return <CarsForSaleClient initialData={[]} />;
}
