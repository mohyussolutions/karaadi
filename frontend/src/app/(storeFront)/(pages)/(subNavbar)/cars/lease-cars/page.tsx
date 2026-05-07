import { getCars } from "@/actions/categories/carActions";
import RentCarsClient from "./RentCarsClient";


export default async function LeaseCarsPage() {

  return <RentCarsClient initialData={[]} />;
}
