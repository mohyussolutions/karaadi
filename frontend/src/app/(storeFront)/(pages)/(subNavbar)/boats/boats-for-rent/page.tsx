import { getBoats } from "@/actions/categories/boatActions";
import BoatsForRentClient from "./BoatsForRentClient";


export default async function BoatsForRentPage() {

  return <BoatsForRentClient initialData={[]} />;
}
