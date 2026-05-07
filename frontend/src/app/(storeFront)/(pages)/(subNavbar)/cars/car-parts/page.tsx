import { getCars } from "@/actions/categories/carActions";
import CarPartsClient from "./CarPartsClient";


export default async function CarPartsPage() {

  return <CarPartsClient initialData={[]} />;
}
