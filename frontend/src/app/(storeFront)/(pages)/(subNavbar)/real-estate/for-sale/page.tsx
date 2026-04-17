import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import FashionAndAccessoriesClient from "./FashionAndAccessoriesClient";

export const revalidate = 60;

export default async function ForSalePage() {
  const data = await getMarketplaceItems(1, 40).catch(() => []);
  return <FashionAndAccessoriesClient initialData={data ?? []} />;
}
