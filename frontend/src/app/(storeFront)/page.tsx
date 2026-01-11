import Search from "./components/shared/search/SearchInput";
import CategoryLinks from "./components/navbar/MainCategoryLinks";
import CardItems from "./components/Cards/mainCard";
import RecomendLinks from "./components/Recommendations/recomendLinks";
import Agencies from "../(agencies)/agencies/page";
import { getBoats } from "@/actions/categories/boatActions";
import { getCars } from "@/actions/categories/carActions";
import { getJobs } from "@/actions/categories/jobActions";
import { getMarketplaceItems } from "@/actions/categories/marketplaceActions";
import { getMotorcycles } from "@/actions/categories/motorcycleActions";
import { getRealEstateListings } from "@/actions/categories/realEstateActions";
import { getTraktors } from "@/actions/categories/tractorActions";
import { getAllSubscriptions } from "@/actions/categories/subscriptionsActions";

export default async function Home() {
  /*
  const reult = await getBoats();
  const result2 = await getCars();
  const result3 = await getJobs();
  const result4 = await getMarketplaceItems();
  const result5 = await getMotorcycles();
  const result6 = await getRealEstateListings();
  const result7 = await getTraktors();
  const result8 = await getAllSubscriptions();
  */
  const commonStyle = "px-2";
  const mainStyleInPage = "space-y-8 py-6";

  return (
    <div className={mainStyleInPage}>
      <div className={commonStyle}>
        <Search />
      </div>
      <div className={commonStyle}>
        <CategoryLinks />
      </div>
      <div className={commonStyle}>
        <Agencies />
      </div>
      <div className={commonStyle}>
        <RecomendLinks />
      </div>
      <div className={commonStyle}>
        <CardItems />
      </div>
    </div>
  );
}
