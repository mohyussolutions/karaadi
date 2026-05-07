import { getCars } from "@/actions/categories/carActions";
import TruckClient from "./TruckClient";


export default async function TruckPage() {

  return <TruckClient initialData={[]} />;
}
