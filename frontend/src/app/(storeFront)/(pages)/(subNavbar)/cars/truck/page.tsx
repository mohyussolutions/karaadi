import { getCars } from "@/actions/categories/carActions";
import TruckClient from "./TruckClient";

export const dynamic = "force-dynamic";

export default async function TruckPage() {

  return <TruckClient initialData={[]} />;
}
