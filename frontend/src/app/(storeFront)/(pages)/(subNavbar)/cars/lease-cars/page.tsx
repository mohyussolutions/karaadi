import { getCars } from "@/actions/categories/carActions";
import RentCarsClient from "./RentCarsClient";

export const dynamic = "force-dynamic";

export default async function LeaseCarsPage() {

  return <RentCarsClient initialData={[]} />;
}
