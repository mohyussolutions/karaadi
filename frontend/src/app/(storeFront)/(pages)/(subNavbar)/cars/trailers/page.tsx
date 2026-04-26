import { getCars } from "@/actions/categories/carActions";
import TrailersClient from "./TrailersClient";

export const dynamic = "force-dynamic";

export default async function TrailersPage() {

  return <TrailersClient initialData={[]} />;
}
