import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import FashionAndAccessoriesClient from "./FashionAndAccessoriesClient";


export default async function ForSalePage() {

  return <FashionAndAccessoriesClient initialData={[]} />;
}
