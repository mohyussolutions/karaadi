import { getCars } from "@/actions/categories/carActions";
import TrailersClient from "./TrailersClient";


export default async function TrailersPage() {

  return <TrailersClient initialData={[]} />;
}
