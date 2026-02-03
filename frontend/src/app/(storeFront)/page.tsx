import CategoryLinks from "./components/navbar/MainCategoryLinks";
import RecomendLinks from "./components/Recommendations/recomendLinks";
import Agencies from "../(agencies)/agencies/page";

import { getBoats } from "@/actions/categories/boatActions";
import { getCars } from "@/actions/categories/carActions";
import { getJobs } from "@/actions/categories/jobActions";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { getTraktors } from "@/actions/categories/tractorActions";
import HomeContent from "./components/Filters/HomeContent";

export default async function Home() {
  const [result, result2, result3, result4, result5, result6, result7] =
    await Promise.all([
      getBoats(),
      getCars(),
      getJobs(),
      getMarketplaceItems(),
      getMotorcycles(),
      getRealEstateListings(),
      getTraktors(),
    ]);

  const initialData = {
    boats: result,
    cars: result2,
    jobs: result3,
    marketplace: result4,
    motorcycles: result5,
    realEstate: result6,
    tractors: result7,
  };

  return (
    <div className="space-y-8 py-6 px-2">
      <HomeContent initialData={initialData}>
        <CategoryLinks />
        <Agencies />
        <RecomendLinks />
      </HomeContent>
    </div>
  );
}
