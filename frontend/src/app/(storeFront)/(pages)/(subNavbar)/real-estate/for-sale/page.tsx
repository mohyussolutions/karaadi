import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import FashionAndAccessoriesClient from "./FashionAndAccessoriesClient";

export const dynamic = "force-dynamic";

export default async function ForSalePage() {

  return <FashionAndAccessoriesClient initialData={[]} />;
}
